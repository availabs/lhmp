import React from 'react'
//import WidthProvider from 'pages/auth/NetworkView/components/utils/WidthProvider'
import { WidthProvider, Responsive as ResponsiveGridLayout} from 'react-grid-layout'
import GraphFactory from './GraphFactory'
import TrackVisibility from 'react-on-screen';

var _ = require('lodash');
const ReactGridLayout = WidthProvider(ResponsiveGridLayout);
const originalLayouts = getFromLS("layouts") || {};
