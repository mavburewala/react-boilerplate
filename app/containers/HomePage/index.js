/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';

import messages from './messages';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';

import { getRepos } from './sagas';

import {
  selectRepos,
  selectLoading,
  selectError,
  selectLocationState,
} from '../../containers/App/selectors';

import {
  selectHome,
  selectUsername,
  currentLogin
} from './selectors';

import { changeUsername } from './actions';
import { loadRepos } from '../App/actions';

import { FormattedMessage } from 'react-intl';
import RepoListItem from '../../containers/RepoListItem';
import Button from '../../components/Button';
import H2 from '../../components/H2';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import LoadingIndicator from '../../components/LoadingIndicator';


import styles from './styles.css';

export class HomePage extends React.Component {

  componentWillMount(){
    console.log('login: ', this.props.login);
    if(this.props.login){
      this.props.onChangeUsername(this.props.login);
    }
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      console.log("Hello I am : ", this.props.username);
      //this.props.onSubmitForm(this.props.username);
    }
  }
  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  /**
   * Changed route to '/features'
   */
  openFeaturesPage = () => {
    this.openRoute('/features');
  };

  render() {
    let mainContent = null;

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);

    // Show an error if there is one
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (this.props.repos !== false) {
      mainContent = (<List items={this.props.repos} component={RepoListItem} />);
    }

    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'A React.js Boilerplate application homepage' },
          ]}
        />
        <div>
          <section className={`${styles.textSection} ${styles.centered}`}>
            <H2>
              <FormattedMessage {...messages.startProjectHeader} />
            </H2>
            <p>
              <FormattedMessage {...messages.startProjectMessage} />
            </p>
          </section>
          <section className={styles.textSection}>
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
            <form
              className={styles.usernameForm}
              onSubmit={(evt) => { if (evt !== undefined && evt.preventDefault){evt.preventDefault() }
                console.log('I am calling');this.props.onSubmitForm(this.props.username)}}
            >
              <label htmlFor="username">
                <FormattedMessage {...messages.trymeMessage} />
                <span className={styles.atPrefix}>
                  <FormattedMessage {...messages.trymeAtPrefix} />
                </span>
                <input
                  id="username"
                  className={styles.input}
                  type="text"
                  placeholder="mxstbr"
                  value={this.props.username}
                  onChange={(e) => this.props.onChangeUsername(e.target.value)}
                />
              </label>
            </form>
            {mainContent}
          </section>
          <Button handleRoute={this.openFeaturesPage}>
            <FormattedMessage {...messages.featuresButton} />
          </Button>
        </div>
      </article>
    );
  }
}

function preload({login}) {
  if(!login){
    return [
    ];
  }
  return [
    [getRepos, {login}]
  ];
}

HomePage.preload = preload;

HomePage.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  login: React.PropTypes.string,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (username) => dispatch(changeUsername(username)),
    changeRoute: (url) => dispatch(push(url)),
    onSubmitForm: (username) => {
      dispatch(loadRepos(username));
    },

    dispatch,
  };
}
// const mapStateToProps = (state) => {
//   return {
//     repos: selectRepos(state),
//     username: selectUsername(state),
//     loading: selectLoading(state),
//     error: selectError(state),
//     //location : selectLocationState(),
//   }
// }
const mapStateToProps = createStructuredSelector({
  repos: selectRepos(),
  username: selectUsername(),
  loading: selectLoading(),
  error: selectError(),
  login : currentLogin(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
