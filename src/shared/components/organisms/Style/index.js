import { connect } from 'react-redux';
import { compose } from 'recompose';
import Style from './Style';

export default compose(
  connect(
    (state) => ({
      genderItems: state.masters.genderMaster.items,
      hairLengthItems: state.masters.hairLengthMaster.items,
    })
  ),
)(Style);
