import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';
import fetchAllCentersRequest from '../../actions/fetchAllCentersRequest';
import { STATES } from '../../consts';
import PaginatedCentersCard from './PaginatedCentersCard';

const propTypes = {
  centers: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  fetchAllCentersRequest: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired
};
/**
 * Featured centers component
 *
 * @class HorizontalFeaturedCenters
 * @extends {React.Component}
 */
export class HorizontalFeaturedCenters extends React.Component {
  /**
   * Creates an instance of HorizontalFeaturedCenters.
   *
   * @param {object} props - React properties
   * @memberof HorizontalFeaturedCenters
   */
  constructor(props) {
    super(props);
    this.state = {
      centers: [],
      count: 0,
      poppedCenter: {}
    };
    this.handleModal = this.handleModal.bind(this);
    this.handlePagingNav = this.handlePagingNav.bind(this);
  }

  /**
   * Initialize materialize modal
   *
   * @returns {void}
   * @memberof HorizontalFeaturedCenters
   */
  componentDidMount() {
    this.props.fetchAllCentersRequest();
    $('.modal').modal();
  }

  /**
   * Update component state
   *
   * @param {object} props new properties
   * @returns {void}
   * @memberof HorizontalFeaturedCenters
   */
  componentWillReceiveProps(props) {
    const { centers, count } = props;
    this.setState({ centers, count });
  }
  /**
   * Handle pop up and populate modal with center data
   *
   * @param {int} id - Center id
   * @returns {void}
   * @memberof HorizontalFeaturedCenters
   */
  handleModal(id) {
    this.setState({
      poppedCenter: this.state.centers.find(center => center.id === id)
    });
    $('#modal1').modal('open');
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
   * Redirect to create event page
   *
   * @returns{void}
   * @memberof HorizontalFeaturedCenters
   */
  bookCenter() {
    const { history } = this.props;
    localStorage.setItem('choice-center', this.state.poppedCenter.id);
    history.push('/user/event');
  }

  /**
   * Renders the component DOM
   *
   * @returns {object} - JSX DOM
   * @memberof HorizontalFeaturedCenters
   */
  render() {
    return (
      <div className="row">
        <div id="modal1" className="modal modal-center">
          <div className="modal-content">
            <div className="row">
              <div className="col s12 m4 l4">
                <img
                  src={this.state.poppedCenter.image}
                  alt="center"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="col s12 m8 l8">
                <h4>{this.state.poppedCenter.name}</h4>
                <p>
                  {this.state.poppedCenter.address}{' '}
                  {STATES[this.state.poppedCenter.state - 1]}
                </p>
                <p>
                  <b>Capacity:</b> {this.state.poppedCenter.capacity}
                </p>
                <p>
                  <b>Amount:</b> N{this.state.poppedCenter.amount}
                </p>
                <p>
                  <b>Facilities:</b>
                </p>
                <p>{this.state.poppedCenter.facilities}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => this.bookCenter()}
              className="modal-action modal-close waves-effect blue btn"
            >
              Book Center
            </button>
          </div>
        </div>

        <PaginatedCentersCard
          centers={this.state.centers}
          count={this.state.count}
          click={this.handleModal}
          handlePagingNav={this.handlePagingNav}
        />
      </div>
    );
  }
}

HorizontalFeaturedCenters.propTypes = propTypes;

/**
 * Extract redux state to component
 *
 * @param {object} state - Redux state
 * @return {object} - Extracted properties
 */
const mapStateToProps = state => {
  const { centers, count } = state.getAvailableCenters;
  return { centers, count };
};

export default connect(mapStateToProps, {
  fetchAllCentersRequest
})(HorizontalFeaturedCenters);
