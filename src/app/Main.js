import React from 'react';
import Request from 'superagent';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PersonalDetailForm from './PersonalDetailForm';
import DocumentUploadForm from './DocumentUploadForm';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

const paperstyle = {
  margin: 20,
  display: 'inline-block',
};

const documentTypes = ["National ID", "Pasport"];


/**
 * Vertical steppers are designed for narrow screen sizes. They are ideal for mobile.
 *
 * To use the vertical stepper with the contained content as seen in spec examples,
 * you must use the `<StepContent>` component inside the `<Step>`.
 *
 * <small>(The vertical stepper can also be used without `<StepContent>` to display a basic stepper.)</small>
 */
class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      finished: false,
      stepIndex: 0,
      upload: false,
      personDetails: {
        salutation: "Mr.",
        first_name: null,
        last_name: null,
        email: null,
        address1: null,
        address2: null,
        postal_code: null,
        city: null,
        country: {
          id: 2,
          name: null
        },
        document_submitted: false,
        document_type: 0,
        document_number: "",
        confirmed: false
      },
      uploadedFileName: null
    };
  }

  submitDetails() {
    const _this = this;
    Request
      .post('https://4ih7avgzp9.execute-api.eu-central-1.amazonaws.com/test/client')
      .send(this.state.personDetails)
      //.set('blanco-Key', 'foobar')
      .set('Accept', 'application/json')
      .end(function(err, res){
        console.log(err, res);
        console.log(_this.state.personDetails);
      });
  }

  handleNext() {
    const {stepIndex} = this.state;
    let doNext = false;
    if (stepIndex === 0 && this.refs.detail_form.isValid()) {
      doNext = true;
      Object.assign(this.state.personDetails, this.refs.detail_form.getPersonDetails());
      this.submitDetails();
    }
    if (stepIndex === 1 && this.refs.upload_form.isValid()) {
      doNext = true;
      Object.assign(this.state.personDetails, this.refs.upload_form.getUploadedDocument());
      this.submitDetails();
      this.state.uploadedFileName = this.refs.upload_form.getUploadedFileName();
    }
    if (stepIndex === 2) {
      doNext = true;
      this.state.personDetails.confirmed = true;
      this.submitDetails();
    }
    if (doNext) {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      });
    }
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  idFileHandler(file) {
    console.log(file);
    this.setState({upload: true});
    Request.put('http://blanco-uploads.s3-website.eu-central-1.amazonaws.com/' + file.name)
    .set("Content-Type", "application/octet-stream")
    .set("key", "test")
    .send(file)
    .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          //this.refs.upload_form.setState({uploadedFileName: file.name});
        }
        this.refs.upload_form.setState({uploadedFileName: file.name});
        this.setState({upload: false});
    })
  }

  renderStepActions(step) {
    const {stepIndex} = this.state;
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label={stepIndex === 2 ? 'Confirm' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext.bind(this)}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev.bind(this)}
          />
        )}
      </div>
    );
  }

  render() {
    const {finished, stepIndex} = this.state;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
          <Dialog
            title="Please wait while we upload you document"
            modal={true}
            open={this.state.upload}
            >
          <LinearProgress mode="indeterminate" />
          </Dialog>
          <Stepper activeStep={stepIndex} orientation="vertical" >
            <Step>
              <StepLabel>Fill in Personal Details</StepLabel>
              <StepContent>
                <PersonalDetailForm ref="detail_form"
                  salutation={this.state.personDetails.salutation}
                  firstName={this.state.personDetails.first_name}
                  lastName={this.state.personDetails.last_name}
                  email={this.state.personDetails.email}
                  address1={this.state.personDetails.address1}
                  address2={this.state.personDetails.address2}
                  postalCode={this.state.personDetails.postal_code}
                  city={this.state.personDetails.city}
                  country={this.state.personDetails.country.id}
                />
                {this.renderStepActions(0)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Upload ID Document</StepLabel>
              <StepContent>
                <DocumentUploadForm
                  ref="upload_form"
                  documentType={this.state.personDetails.document_type}
                  documentNumber={this.state.personDetails.document_number}
                  uploadedFileName={this.state.uploadedFileName}
                  idFileHandler={this.idFileHandler.bind(this)}
                  />

                {this.renderStepActions(1)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Confirmation</StepLabel>
              <StepContent>
                <Paper style={paperstyle} zDepth={1} >
                  <List>
                    <ListItem primaryText={`Salutation: ${this.state.personDetails.salutation}`}/>
                    <ListItem primaryText={`First Name: ${this.state.personDetails.first_name}`}/>
                    <ListItem primaryText={`Last Name: ${this.state.personDetails.last_name}`}/>
                    <ListItem primaryText={`Email: ${this.state.personDetails.email}`}/>
                    <ListItem primaryText={`Address Line 1:  ${this.state.personDetails.address1}`}/>
                    <ListItem primaryText={`Address Line 2: ${this.state.personDetails.address2}`}/>
                    <ListItem primaryText={`Postal Code: ${this.state.personDetails.postal_code}`}/>
                    <ListItem primaryText={`City: ${this.state.personDetails.city}`}/>
                    <ListItem primaryText={`Country: ${this.state.personDetails.country.name}`}/>
                    <ListItem primaryText={`Document Type: ${documentTypes[this.state.personDetails.document_type]}`}/>
                    <ListItem primaryText={`Document Number: ${this.state.personDetails.document_number}`}/>
                  </List>
                </Paper>
                {this.renderStepActions(2)}
              </StepContent>
            </Step>
          </Stepper>
          {finished && (
            <p style={{margin: '20px 0', textAlign: 'center'}}>
              Congratulations!!!, You are succesfully onboard Blanco Platform.
            </p>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
