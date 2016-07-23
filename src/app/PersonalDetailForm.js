import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const items = [];
const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
for (let i = 0; i < countries.length; i++ ) {
  items.push(<MenuItem value={i} key={i} primaryText={`${countries[i]}`} />);
}

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    display: 'inline-block',
    marginBottom: 16,
  },
  labelStyle: {
    color: '#000',
  }
};


class PersonalDetailForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {country: props['country']};
  }

  isValid() {
      // TODO validations
      return true;
  }

  getPersonDetails() {
    return {
      salutation: this.refs.salutation.getSelectedValue(),
      first_name: this.refs.first_name.getValue() === "" ? null : this.refs.first_name.getValue(),
      last_name: this.refs.last_name.getValue() === "" ? null : this.refs.last_name.getValue(),
      email: this.refs.email.getValue() === "" ? null : this.refs.email.getValue(),
      address1: this.refs.address_line_1.getValue() === "" ? null : this.refs.address_line_1.getValue(),
      address2: this.refs.address_line_2.getValue() === "" ? null : this.refs.address_line_2.getValue(),
      postal_code: this.refs.postal_code.getValue() === "" ? null : this.refs.postal_code.getValue(),
      city: this.refs.city.getValue() === "" ? null : this.refs.city.getValue(),
      country: {
        id: this.state.country,
        name: countries[this.state.country]
      }
    }
  }

  handleCountryChange(event, index, value) {
    this.setState({country:value});
  };

  render() {
    return (
      <div>
      <br />
        <RadioButtonGroup ref="salutation" name="shipSpeed" defaultSelected={this.props.salutation || "mr"} style={{ display: 'flex' }}>
          <RadioButton
            value="Mr."
            label="Mr."
            style={styles.radioButton}
            labelStyle={styles.labelStyle}
          />
          <RadioButton
            value="Mrs."
            label="Mrs."
            style={styles.radioButton}
          />
          <RadioButton
            value="Ms."
            label="Ms."
            style={styles.radioButton}
          />
        </RadioButtonGroup>
        <TextField
          ref="first_name"
          floatingLabelText="First Name"
          defaultValue={this.props.firstName}
        /><br />
        <TextField
          ref="last_name"
          floatingLabelText="Last Name"
          defaultValue={this.props.lastName}
        /><br />
        <TextField
          ref="email"
          floatingLabelText="Email"
          defaultValue={this.props.email}
        /><br />
        <TextField
          ref="address_line_1"
          floatingLabelText="Address Line 1"
          defaultValue={this.props.address1}
        /><br />
        <TextField
          ref="address_line_2"
          floatingLabelText="Address Line 2"
          defaultValue={this.props.address2}
        /><br />
        <TextField
          ref="postal_code"
          floatingLabelText="Postal Code"
          defaultValue={this.props.postalCode}
        /><br />
        <TextField
          ref="city"
          floatingLabelText="City"
          defaultValue={this.props.city}
        /><br />
        <SelectField value={this.state.country || this.props.country}
          onChange={this.handleCountryChange.bind(this)} ref="country"
          floatingLabelText="Country" maxHeight={200}>
          {items}
        </SelectField><br />
    </div>
    );
  }
}

export default PersonalDetailForm;
