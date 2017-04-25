import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, onlyUpdateForPropTypes, setPropTypes } from 'recompose';
import Menu from '../../atoms/Menu';
import MenuItem from '../../atoms/MenuItem';

export default compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    gender: PropTypes.string,
    genderItems: PropTypes.object.isRequired,
  }),
)(class GenderMenu extends Component {
  render() {
    const { genderItems } = this.props;
    const gender = this.props.gender || Object.keys(genderItems)[0];

    return (
      <div>
        <Menu>
          {Object.keys(genderItems).map((code) => (
            <MenuItem key={code} to={`/style/${code}`} checked={code === gender}>
              {genderItems[code].name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
});
