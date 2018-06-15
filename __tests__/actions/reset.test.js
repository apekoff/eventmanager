/* global describe it expect */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionType from '../../client/src/types';
import reset from '../../client/src/actions/reset';

const mockStore = configureStore([thunk]);

describe('Reset Action', () => {
  it('dispatch an action', (done) => {
    const expectedActions = [{ type: actionType.FETCH_USER_REQUEST }];
    const store = mockStore({});
    store.dispatch(reset('FETCH_USER_REQUEST'));
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });
});
