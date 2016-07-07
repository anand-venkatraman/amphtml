/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    createIframePromise,
    doNotLoadExternalResourcesInTest,
} from '../../../../testing/iframe';
import '../amp-o2-player';
import {adopt} from '../../../../src/runtime';

adopt(window);

describe('amp-o2-player', () => {

  function getO2player(attributes, opt_responsive) {
    return createIframePromise(true).then(iframe => {
      doNotLoadExternalResourcesInTest(iframe.win);
      const o2 = iframe.doc.createElement('amp-o2-player');
      for (const key in attributes) {
        o2.setAttribute(key, attributes[key]);
      }
      o2.setAttribute('width', '111');
      o2.setAttribute('height', '222');
      if (opt_responsive) {
        o2.setAttribute('layout', 'responsive');
      }
      iframe.doc.body.appendChild(o2);
      o2.implementation_.layoutCallback();
      return o2;
    });
  }

  it('renders', () => {
    return getO2player({
      'data-pid': '123',
      'data-bcid': '456',
    }).then(o2 => {
      const iframe = o2.querySelector('iframe');
      expect(iframe).to.not.be.null;
      expect(iframe.tagName).to.equal('IFRAME');
      expect(iframe.src).to.equal(
          'https://delivery.vidible.tv/htmlembed/pid=123/456.html');
      expect(iframe.getAttribute('width')).to.equal('111');
      expect(iframe.getAttribute('height')).to.equal('222');
    });
  });

  it('renders responsively', () => {
    return getO2player({
      'data-pid': '573acb47e4b0564ec2e10011',
      'data-bcid': '50d595ec0364e95588c77bd2',
    }, true).then(o2 => {
      const iframe = o2.querySelector('iframe');
      expect(iframe).to.not.be.null;
      expect(iframe.className).to.match(/-amp-fill-content/);
    });
  });

  it('requires data-pid && data-bcid or data-vid', () => {
    return getO2player({}).should.eventually.be.rejectedWith(
        /Either data-pid and data-bcid or data-vid attribute is required for/);
  });

  it('renders with data-vid passed', () => {
    return getO2player({
      'data-vid': '123',
    }).then(o2 => {
      const iframe = o2.querySelector('iframe');
      expect(iframe).to.not.be.null;
      expect(iframe.tagName).to.equal('IFRAME');
      expect(iframe.src).to.equal(
          'https://delivery.vidible.tv/htmlembed/123.html');
      expect(iframe.getAttribute('width')).to.equal('111');
      expect(iframe.getAttribute('height')).to.equal('222');
    });
  });

  it('renders with data-macros passed', () => {
    return getO2player({
      'data-vid': '123',
      'data-macros': 'm.test=test',
    }).then(o2 => {
      const iframe = o2.querySelector('iframe');
      expect(iframe).to.not.be.null;
      expect(iframe.tagName).to.equal('IFRAME');
      expect(iframe.src).to.equal(
          'https://delivery.vidible.tv/htmlembed/123.html?m.test=test');
      expect(iframe.getAttribute('width')).to.equal('111');
      expect(iframe.getAttribute('height')).to.equal('222');
    });
  });

  it('respects data-env parameter', () => {
    return getO2player({
      'data-vid': '123',
      'data-env': 'stage',
    }).then(o2 => {
      const iframe = o2.querySelector('iframe');
      expect(iframe).to.not.be.null;
      expect(iframe.tagName).to.equal('IFRAME');
      expect(iframe.src).to.equal(
          'https://delivery.dev.vidible.tv/htmlembed/123.html');
      expect(iframe.getAttribute('width')).to.equal('111');
      expect(iframe.getAttribute('height')).to.equal('222');
    });
  });
});
