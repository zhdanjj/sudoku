/* eslint-disable */

import App from './components/App.vue';
import Vue from 'vue';
import './styles.scss';

let d = document.createElement('div');
d.setAttribute('id', 'app');
document.body.appendChild(d);

new Vue({
  el: d,
  components: { App },
  render: h => h(App),
});
