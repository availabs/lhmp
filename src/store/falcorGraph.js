import { Model } from 'falcor';
import HttpDataSource from 'falcor-http-datasource';
// import { '' } from 'config';

import store from "store"
import { update } from "utils/redux-falcor/components/duck"

import throttle from "lodash.throttle"

var Promise = require("bluebird");



//let url = 'https://graph.availabs.org/'
let url = 'http://localhost:4444/'


if (process.env.NODE_ENV === 'production') {
  url = 'https://graph.availabs.org/'
}

console.log('url', url,process.env.NODE_ENV)
class CustomSource extends HttpDataSource {
  onBeforeRequest(config) {
    if (localStorage) {
      const userToken = localStorage.getItem('userToken');
      config.headers['Authorization'] = userToken;
    }
  }
}

export const falcorGraph = (function() {
  var storedGraph = graphFromCache() // {};//JSON.parse(localStorage.getItem('falcorCache'))
  let model = new Model({
    source: new CustomSource(url + 'graph/', {
      crossDomain: true,
      withCredentials: false,
      timeout: 0
    }),
    errorSelector: function(path, error) {
      console.log('errorSelector', path, error);
      return error;
    },
    cache: storedGraph || {}
  })
  //.batch();
  return model;
})();

window.addEventListener('beforeunload', function(e) {
  var getCache = falcorGraph.getCache();
  console.log('windowUnload', getCache);
  localStorage.setItem('falcorCache', JSON.stringify(getCache));
  // debugger
});

// onBeforeRequest (config) {
// var token = ''
// if (localStorage) {
// token = localStorage.getItem('token')
// }
// config.headers['Authorization'] = `${token}`
// // console.log('header', config.headers)
// config.url = config.url.replace(/%22/g, '%27')
// // config.url = config.url.replace(/"/g, "'")
// var splitUrl = config.url.split('?')
// if (splitUrl[1] && config.method === 'GET') {
// // config.url = splitUrl[0] + '?' + encodeURI(splitUrl[1])
// delete config.headers
// } else if (config.method === 'POST') {
// config.method = 'GET'
// delete config.headers
// config.url = config.url + '?' + config.data.replace(/%22/g, '%27')
// // console.log(config.url)
// }
// console.log('FR:', config)
// }

const NO_OP = () => {}

export const chunker = (values, request, options = {}) => {
  const {
    placeholder = "replace_me",
    chunkSize = 100
  } = options;

  const requests = [];

  for (let n = 0; n < values.length; n += chunkSize) {
    requests.push(request.map(r => r === placeholder ? values.slice(n, n + chunkSize) : r));
  }
  return requests.length ? requests : [request];
}

export const falcorChunker = (values, request, options = {}) => {
  if (request !== null) {
    values = [values, request];
  }
  const {
    falcor = falcorGraph,
    callback = NO_OP,
    concurrency = 4,
    ...rest
  } = options;

  let curr = 0, total = 0;

  const chunks = [];

  const throttledCB = throttle(callback, 50);

  values.forEach(([v, r]) => {
    const temp = chunker(v, r, rest);
    total += temp.length;
    chunks.push(...temp);
  })

  throttledCB(curr, total);

  return Promise
    .map(chunks, c =>
       falcor.get(c)
        // .then(() => new Promise(r => setTimeout(r, 250)))
        .then(() => {
          ++curr;
          throttledCB(curr, total);
        })
    , { concurrency })

  // return chunks
  //   .reduce((a, c) =>
  //     a.then(() => falcor.get(c))
  //       .then(() => callback(++curr, total))
  //   , Promise.resolve());
}

export const falcorChunkerWithUpdate = (values, request, options = {}) =>
  falcorChunker(values, request, options)
    .then(() => {
      const {
        falcor = falcorGraph
      } = options;
      store.dispatch(update(falcor.getCache()));
    });

const getArgs = args =>
  args.reduce((a, c) => {
    if (Array.isArray(c)) {
      a[0].push(c);
    }
    else {
      a[1] = c;
    }
    return a;
  }, [[], {}])

export const falcorChunkerNice = (...args) => {
  const [requests, options] = getArgs(args);
  const {
    index = null,
    placeholder = "replace_me",
    ...rest
  } = options;

  // let values = [], found = false;

  const reduced = requests.reduce((a, c) => {
    let values = [], found = false;

    const replace = c.map((r, i) => {
      if (Array.isArray(r) && !found && (index === null || index === i)) {
        found = true;
        values = r;
        return placeholder;
      }
      return r;
    })
    a.push([values, replace])
    return a;
  }, [])

  return falcorChunker(reduced, null, { ...rest, placeholder });
}

export const falcorChunkerNiceWithUpdate = (...args) =>{
  console.log('args', args)
  return falcorChunkerNice(...args)
    .then(() => {
      const [, options] = getArgs(args);
      const {
        falcor = falcorGraph
      } = options;
      store.dispatch(update(falcor.getCache()));
    });
}

function graphFromCache () {
  console.time('restoreGraph')
  let restoreGraph = {}
  if (localStorage && localStorage.getItem('falcorCache')) {
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('currentUser')
    console.log(token, user, token && user)
    //if (token && user) {
      // restoreGraph = JSON.parse(localStorage.getItem('falcorCache'))
    //}
  }
  console.timeEnd('restoreGraph')
  console.log('restoreGraph', restoreGraph)
  return restoreGraph // {}
}
