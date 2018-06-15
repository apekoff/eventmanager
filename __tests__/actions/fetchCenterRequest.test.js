/* global describe beforeAll afterAll it expect */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actionType from '../../client/src/types';
import { fetchCenterRequest } from '../../client/src/actions/fetchCenterRequest';
import { API_PATH } from '../../client/src/consts';
import { userMock, center, event } from '../__mocks__/mockData';
import instance from '../../client/src/utils/axios';

const mockStore = configureStore([thunk]);

describe('Fetch Single Center Request', () => {
  beforeAll(() => moxios.install(instance));
  afterAll(() => moxios.uninstall());

  describe('Fetch Single Center Action', () => {
    it('should dispatch fetch center action', (done) => {
      moxios.stubRequest(`${API_PATH}/centers/1`, {
        status: 200,
        response: {
          center
        }
      });
      const expectedActions = [
        { type: 'FETCHING_CENTER' },
        {
          type: actionType.RECEIVED_CENTER,
          center
        }
      ];
      const store = mockStore({ ...userMock });
      store.dispatch(fetchCenterRequest(1)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });

    it('should dispatch fetch center with events action', (done) => {
      const centerWithEvent = { center, events: [event], count: 1 };
      moxios.stubRequest(`${API_PATH}/centers/admin/center?page=1`, {
        status: 200,
        response: {
          ...centerWithEvent
        }
      });

      const expectedActions = [
        { type: 'FETCHING_CENTER' },
        {
          type: actionType.RECEIVED_ADMIN_CENTER,
          center: centerWithEvent.center,
          events: centerWithEvent.events,
          count: 1
        }
      ];
      const store = mockStore({ ...userMock });
      store.dispatch(fetchCenterRequest(1, { page: 1 }, true)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
    });
  });
});
