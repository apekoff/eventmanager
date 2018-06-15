import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import toastr from 'toastr';
import $ from 'jquery';
import fetchUserEventsRequest from '../../actions/fetchUserEventsRequest';
import fetchUserRequest from '../../actions/fetchUserRequest';
import deleteEventRequest from '../../actions/deleteEventRequest';
import reset from '../../actions/reset';
import HorizontalFeaturedCenters from '../containers/HorizontalFeaturedCenters';
import Preloader from '../containers/Preloader';
import { STATES } from '../../consts';
import { hasFlash, getFlash, addFlash } from '../../utils/flash';
import {
  CREATED_EVENT,
  FETCHING_EVENTS,
  DELETED_EVENT,
  RESET_DELETING_EVENT
} from '../../types';
import Pagination from '../containers/Pagination';

const propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  history: PropTypes.shape().isRequired,
  fetchUserRequest: PropTypes.func.isRequired,
  fetchUserEventsRequest: PropTypes.func.isRequired
};

/**
 * Base component for User Component
 *
 * @class Index
 * @extends {Component}
 */
export class Index extends Component {
  /**
   * Creates an instance of Index.
   *
   * @param {object} props - React properties
   * @memberof Index
   */
  constructor(props) {
    super(props);
    this.state = {
      poppedEvent: null
    };
    this.handlePagingNav = this.handlePagingNav.bind(this);
  }

  /**
   * Fetch all user events
   *
   * @returns {void}
   * @memberof Index
   */
  componentWillMount() {
    if (hasFlash('saveRoute')) {
      return this.props.history.push(getFlash('saveRoute'));
    }
    if (hasFlash(CREATED_EVENT)) {
      toastr.options = {
        positionClass: 'toast-top-full-width',
        showDuration: '300',
        hideDuration: '2000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      };
      toastr.success(getFlash(CREATED_EVENT));
    }
  }

  /**
   * Fetch user and events
   *
   * @returns {void}
   * @memberof Index
   */
  componentDidMount() {
    this.props.fetchUserEventsRequest();
    this.props.fetchUserRequest();
    $('.modal').modal();
  }

  /**
   * Receive new properties from store
   *
   * @param {object} newProps New Properties
   * @returns {void}
   * @memberof Index
   */
  componentWillReceiveProps(newProps) {
    const { events, actions } = newProps;

    let page = 0;

    if (
      events.length === 0 &&
      hasFlash('page') &&
      (page = getFlash('page')) > 1
    ) {
      this.props.fetchUserEventsRequest({ page: page - 1 });
      this.props.actions.getEvents = FETCHING_EVENTS;
      addFlash(page - 1);
      return;
    }

    if (actions.cancel === DELETED_EVENT) {
      page = getFlash('page') || 1;
      this.props.reset(RESET_DELETING_EVENT);
      this.props.fetchUserEventsRequest({ page });
      addFlash(page);
    }
  }

  /**
   * Fetch paging
   *
   * @param {number} index page cliced
   * @returns {void}
   */
  handlePagingNav(index) {
    this.props.fetchUserEventsRequest({ page: index });
    addFlash('page', index);
  }

  /**
   * Redirect to update event
   *
   * @param {int} id - Event id
   * @returns {void}
   * @memberof Index
   */
  handleEditEvent(id) {
    this.props.history.push(`/user/event/update/${id}`);
  }

  /**
   * Set pop event and activate pop up
   *
   * @param {any} id Event id
   * @returns {void}
   * @memberof Index
   */
  handleDeletePopEvent(id) {
    this.setState({ poppedEvent: id });
    $('#modalEvent').modal('open');
  }

  /**
   * Deletes events
   *
   * @returns {void}
   * @memberof Index
   */
  cancelEvent() {
    this.props.deleteEventRequest(this.state.poppedEvent);
  }

  /**
   * Renders the component DOM object
   *
   * @returns {object} - JSX DOM
   * @memberof Index
   */
  render() {
    if (this.props.actions.getEvents === FETCHING_EVENTS) {
      return (
        <div className="preloader">
          <Preloader />
        </div>
      );
    }
    return (
      <div className="container container-medium event">
        <div id="modalEvent" className="modal">
          <div className="modal-content">
            <h5>Are you sure you want to cancel this event?</h5>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => this.cancelEvent()}
              className="modal-action modal-close waves-effect red btn"
              style={{ marginRight: '5px' }}
            >
              Cancel Event
            </button>
            <button className="modal-action modal-close waves-effect waves-green btn">
              Go Back
            </button>
          </div>
        </div>

        <div className="row center">
          <div className="col s12 m12 l12">
            <h4>Booked Events</h4>
            <hr />
          </div>

          <div className="col s12 m12 l12">
            {this.props.events.length ? (
              <div className="row">
                <div className="col s12 m12 l12">
                  <div className="row animated fadeIn">
                    {this.props.events.map(event => {
                      let daysRemaining = moment(event.startDate).diff(
                        moment(),
                        'days'
                      );

                      if (daysRemaining < 0) {
                        daysRemaining = 0;
                      }

                      const daysRemainingDOM = (
                        <span>
                          <p>{daysRemaining}</p>
                          <p>Day{daysRemaining > 1 && 's'}</p>
                          <p className="remaining">Remaining</p>
                        </span>
                      );

                      return (
                        <div className="col s12 m4 l4" key={event.id}>
                          <div
                            className="card-panel event-card-user"
                            style={{ maxHeight: '290px' }}
                          >
                            <h6 className="truncate">
                              <span>{event.title}</span>
                              <i
                                onClick={() =>
                                  this.handleDeletePopEvent(event.id)
                                }
                                tabIndex="-99999"
                                onKeyUp={() =>
                                  this.handleDeletePopEvent(event.id)
                                }
                                role="button"
                                className="material-icons right delete"
                              >
                                clear
                              </i>
                              <i
                                onClick={() => this.handleEditEvent(event.id)}
                                tabIndex="-99999"
                                onKeyUp={() => this.handleEditEvent(event.id)}
                                role="button"
                                className="material-icons right edit"
                              >
                                edit
                              </i>
                            </h6>
                            <hr />
                            <div className="row venue">
                              <div className="col s12 m2 l2">
                                <i className="material-icons left">
                                  location_on
                                </i>
                              </div>
                              {event.centerId != 0 ? (
                                <div className="col s12 m9 l9">
                                  <h6 className="truncate">
                                    {event.center.name}
                                  </h6>
                                  <p>
                                    {event.center.area},{' '}
                                    {STATES[event.center.state - 1]}
                                  </p>
                                </div>
                              ) : (
                                <div className="col s12 m9 l9 event-cancelled">
                                  <h6 className="truncate">EVENT CANCELLED</h6>
                                  <p>
                                    You may want to click the edit button above
                                    to change center.
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="row timer">
                              <div className="col s12 m2 l2">
                                <i className="material-icons">access_time</i>
                              </div>
                              <div className="col s12 m9 l9">
                                <div className="col s12 m4 l4">
                                  <p>{moment(event.startDate).format('Do')}</p>
                                  <p>
                                    {moment(event.startDate).format('MMM')}.
                                  </p>
                                </div>
                                <div className="col s12 m8 l8">
                                  {daysRemainingDOM}
                                </div>
                              </div>
                            </div>
                            <div className="row date" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col s12 m12 l12">
                  <Pagination
                    total={this.props.count}
                    handlePagingNav={this.handlePagingNav}
                  />
                </div>
              </div>
            ) : (
              <h6 style={{ marginBottom: '150px', marginTop: '20px' }}>
                <span>You do not have any booking information.</span>
                <a href="/user/event" style={{ display: 'block' }}>
                  Book Your Event Now
                </a>
              </h6>
            )}
          </div>
        </div>
        <hr />
        <h5 className="center">AVAILABLE CENTERS</h5>
        <hr />
        <div className="row center event_center">
          <div className="col s12 m12 l12">
            {<HorizontalFeaturedCenters history={this.props.history} />}
          </div>
        </div>
      </div>
    );
  }
}

Index.propTypes = propTypes;

/**
 * Extract properties from redux state
 *
 * @param {object} state - Redux state
 * @returns {object} - Extracted properties
 */
const mapStateToProps = state => {
  const { events, count, actions } = state.event;
  return { events, count, actions };
};

export default connect(
  mapStateToProps,
  {
    fetchUserEventsRequest,
    fetchUserRequest,
    deleteEventRequest,
    reset
  }
)(Index);
