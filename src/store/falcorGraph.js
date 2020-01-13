// import { host } from '../constants'
import { Model } from 'falcor'
import HttpDataSource from 'falcor-http-datasource'

import store from "store"
import { update } from "utils/redux-falcor/components/duck"


export let host = 'http://localhost:4444/'

if (process.env.NODE_ENV === 'production') {
  host = 'https://graph.availabs.org/'
}

//host = 'http://localhost:4444/'; //env blank obj
// export const host = 'https://mitigateny.availabs.org/api/'
class CustomSource extends HttpDataSource {
  onBeforeRequest (config) {
    // var token = ''
    // if (localStorage) {
    //   token = localStorage.getItem('token')
    // }
    // config.headers['Authorization'] = `${token}`
    // // console.log('header', config.headers)
    // config.url = config.url.replace(/%22/g, '%27')
    // // config.url = config.url.replace(/"/g, "'")
    // var splitUrl = config.url.split('?')
    // if (splitUrl[1] && config.method === 'GET') {
    //   // config.url = splitUrl[0] + '?' + encodeURI(splitUrl[1])
    //   delete config.headers
    // } else if (config.method === 'POST') {
    //   config.method = 'GET'
    //   delete config.headers
    //   config.url = config.url + '?' + config.data.replace(/%22/g, '%27')
    //   // console.log(config.url)
    // }
    // console.log('FR:', config)
  }
}

// function graphFromCache () {
//   let restoreGraph = {}
//   if (localStorage && localStorage.getItem('falcorCache')) {
//     let token = localStorage.getItem('token')
//     let user = localStorage.getItem('currentUser')
//     if (token && user) {
//       restoreGraph = JSON.parse(localStorage.getItem('falcorCache'))
//     }
//   }
//   return restoreGraph // {}
// }

export const falcorGraph = (function () {
  var storedGraph = {} // graphFromCache() // {};//JSON.parse(localStorage.getItem('falcorCache'))
  let model = new Model({
    source: new CustomSource(host + 'graph', {
      crossDomain: true,
      withCredentials: false
    }),
    errorSelector: function (path, error) {
      console.log('errorSelector', path, error)
      return error
    },
    cache: storedGraph || {}
  }).batch()
  return model
})()

export const chunker = (values, request, options = {}) => {
  const {
    placeholder = "replace_me",
    chunkSize = 50
  } = options;

  const requests = [];

  for (let n = 0; n < values.length; n += chunkSize) {
    requests.push(request.map(r => r === placeholder ? values.slice(n, n + chunkSize) : r));
  }

  return requests;
}
export const falcorChunker = (values, request, options = {}) => {
  const {
    falcor = falcorGraph,
    ...rest
  } = options;

  return chunker(values, request, rest).reduce((a, c) => a.then(() => falcor.get(c)), Promise.resolve());
}

export const falcorChunkerWithUpdate = (...args) =>
  falcorChunker(...args)
    .then(() => store.dispatch(update(falcorGraph.getCache())));

export const falcorChunkerNice = (request, options = {}) => {
  const {
    index = null,
    placeholder = "replace_me",
    ...rest
  } = options;

  let values = [], found = false;

  const replace = request.map((r, i) => {
    if (Array.isArray(r) && !found && (index === null || index === i)) {
      found = true;
      values = r;
      return placeholder;
    }
    return r;
  })
  return falcorChunker(values, replace, { ...rest, placeholder });
}
export const falcorChunkerNiceWithUpdate = (...args) =>
  falcorChunkerNice(...args)
    .then(() => store.dispatch(update(falcorGraph.getCache())));

window.addEventListener('beforeunload', function (e) {
  var getCache = falcorGraph.getCache()
  console.log('windowUnload', getCache)
  localStorage.setItem('falcorCache', JSON.stringify(getCache))
})
