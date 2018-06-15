import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import toastr from 'toastr';
import { updateEventRequest } from '../../../actions/updateEventRequest';
import fetchUserEventRequest from '../../../actions/fetchUserEventRequest';
import fetchAllCentersRequest from '../../../actions/fetchAllCentersRequest';
import { CenterDetailsSimple } from '../../admin/center/CenterDetailsSimple';
import InputField from '../../containers/forms/InputField';
import Error from '../../containers/Error';
import DatePicker from '../../containers/forms/DatePicker';
import reset from '../../../actions/reset';
import {
  UPDATE_EVENT_ERROR,
  REQUEST_UPDATE_EVENT,
  UPDATED_EVENT,
  RECEIVED_EVENT,
  FETCHING_EVENT,
  RECEIVED_CENTERS
} from '../../../types';
import PaginatedCentersCard from '../../containers/PaginatedCentersCard';
import Preloader from '../../containers/Preloader';

const propTypes = {
  updateEventRequest: PropTypes.func.isRequired,
  centers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ index: PropTypes.string.isRequired }).isRequired
  }).isRequired,
  event: PropTypes.shape({
    title: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    centerId: PropTypes.number
  }).isRequired,
  errors: PropTypes.shape().isRequired,
  actions: PropTypes.shape().isRequired,
  reset: PropTypes.func.isRequired
};

/**
 * Create event for center
 *
 * @class Create
 * @extends {React.Component}
 */
export class Update extends React.Component {
  /**
   * Creates an instance of Create.
   *
   * @param {object} props - React properties
   * @memberof Create
   */
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      centers: [],
      count: 0,
      activeCenter: {},
      errors: {}
    };
    this.handleFormFieldChanged = this.handleFormFieldChanged.bind(this);
    this.changeActiveCenter = this.changeActiveCenter.bind(this);
    this.handlePagingNav = this.handlePagingNav.bind(this);
  }
  /**
   * Set center for event
   *
   * @returns {void}
   * @memberof Create
   */
  componentWillMount() {
    this.props.fetchAllCentersRequest();
    this.props.fetchUserEventRequest(this.props.match.params.index);
  }

  /**
   * Update component state when state events occur
   *
   * @param {object} props - New properties
   * @return {void}
   * @memberof Create
   */
  componentWillReceiveProps(props) {
    const {
      errors, actions, event, centers, centerAction, count
    } = props;

    if (actions.updateEvent === UPDATE_EVENT_ERROR) {
      this.setState({ errors });
    }

    if (
      actions.getEvent === RECEIVED_EVENT &&
      actions.updateEvent !== UPDATED_EVENT
    ) {
      this.setState({ event, activeCenter: event.center || centers[0] });
    }

    if (centerAction.getCenters === RECEIVED_CENTERS) {
      this.setState({ centers, count });
    }

    if (actions.updateEvent === UPDATED_EVENT) {
      this.setState({ event, activeCenter: event.center });
      toastr.options = {
        positionClass: 'toast-top-full-width',
        showDuration: '300',
        hideDuration: '2000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      };
      toastr.success('Event Updated.');
    }
  }

  componentWillUnmount() {
    this.props.reset(FETCHING_EVENT);
    this.props.reset(REQUEST_UPDATE_EVENT);
  }

  /**
   * Method changes the property of center object in state
   *
   * @param {object} event - DOM object of changed element
   *
   * @returns {void}
   */
  handleFormFieldChanged(event) {
    let { value, id } = event.target;
    if (id === 'startDate' || id === 'endDate') {
      value = moment(new Date(value), 'YYYY-MM-D').format('YYYY-MM-D');
    }
    this.setState({
      event: {
        ...this.state.event,
        [id]: value
      }
    });
  }

  /**
   * Fetch paging
   *
   * @param {number} index page clicked
   * @returns {void}
   */
  handlePagingNav(index) {
    this.props.fetchAllCentersRequest({ page: index });
  }

  /**
   * Change selected center for event
   *
   * @param {int} centerid - Center ID
   * @returns {void}
   * @memberof Create
   */
  changeActiveCenter(centerid) {
    const activeCenter = this.state.centers.find(center => centerid === center.id);

    $('html, body').animate(
      {
        scrollTop: $('.event-center-detailed').offset().top
      },
      1000
    );

    this.setState({
      activeCenter
    });
  }
  /**
   * Create event for center
   *
   * @param {object} event - DOM event
   * @returns {void}
   */
  updateEvent(event) {
    event.preventDefault();
    this.setState(
      {
        event: {
          ...this.state.event,
          centerId: this.state.activeCenter.id
        }
      },
      () => this.props.updateEventRequest(this.state.event)
    );
  }

  /**
   * Render Create Event Component
   *
   * @returns {object} - JSX DOM
   */
  render() {
    if (this.props.actions.getEvent === FETCHING_EVENT) {
      return (
        <div className="preloader">
          <Preloader />
        </div>
      );
    }
    return (
      <div className="container container-medium card">
        <h5>Edit Event</h5>
        <form>
          <h4>
            <Error messages={this.state.errors.global} />
          </h4>
          <div className="row">
            <InputField
              onChange={this.handleFormFieldChanged}
              defaultValue={this.state.event.title}
              id="title"
              type="text"
              title="Event Title"
              width="8"
              errorMessage={this.state.errors.title}
            />
          </div>

          <div className="row">
            <DatePicker
              onChange={this.handleFormFieldChanged}
              id="startDate"
              type="text"
              title="Start Date"
              width="6"
              errorMessage={this.state.errors.startDate}
              defaultValue={this.state.event.startDate}
            />

            <DatePicker
              onChange={this.handleFormFieldChanged}
              id="endDate"
              type="text"
              title="End Date"
              width="6"
              errorMessage={this.state.errors.endDate}
              defaultValue={this.state.event.endDate}
            />
          </div>

          <CenterDetailsSimple center={this.state.activeCenter} />
          <div className="row">
            <button
              className="btn blue right"
              onClick={event => this.updateEvent(event)}
            >
              Update Event
            </button>
          </div>
        </form>

        <hr />
        <div className="row">
          <div className="col s12 m12 l12">
            <h5>Available Centers</h5>
            <p style={{ fontSize: '17px', textAlign: 'center' }}>
              <strong>
                * You can choose any of the centers below for your event. Simply
                click on one to update the booking application.
              </strong>
            </p>
          </div>
        </div>
        <PaginatedCentersCard
          centers={this.state.centers}
          count={this.state.count}
          click={this.changeActiveCenter}
          handlePagingNav={this.handlePagingNav}
        />
      </div>
    );
  }
}

Update.propTypes = propTypes;

/**
 * Extract properties from redux and map it to component properties
 *
 * @param {object} state - Redux state
 *
 * @returns {object} - Extracted state
 */
const mapStateToProps = state => {
  const { centers, count } = state.getAvailableCenters;
  const { errors, actions, event } = state.event;

  return {
    centers,
    count,
    centerAction: state.getAvailableCenters.action,
    errors,
    actions,
    event
  };
};

export default connect(
  mapStateToProps,
  {
    updateEventRequest,
    fetchUserEventRequest,
    fetchAllCentersRequest,
    reset
  }
)(Update);
