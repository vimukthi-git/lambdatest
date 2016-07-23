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
import AppBar from 'material-ui/AppBar';
import FileIcon from 'material-ui/svg-icons/file/file-download';
import IconButton from 'material-ui/IconButton';

AWS.config.region = 'eu-west-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:24d1cd18-f53a-4f67-b91c-7683c843852c'
});


const paperstyle = {
  margin: 20,
  width: '80%',
  display: 'inline-block',
};

const tablestyle = {
  display: 'table',
  borderCollapse: 'separate',
  borderSpacing: 10,
};

const rowstyle = {
  display:'table-row'
};

const cellstyle = {
  display: 'table-cell',
  padding: 10
};



const documentTypes = ["National ID", "Pasport"];

/**
Main work flow manager component
**/
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
        document_number: null,
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
      .set('x-api-Key', 'd4eak85a5w8SV2EfvLUE1aF30D9V33V5aFTvSmsO')
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
    this.setState({upload: true});

    AWS.config.credentials.get(function(err) {
        if (err) alert(err);
        //console.log(AWS.config.credentials);
    });

    var bucketName = 'blanco-files'; // Enter your bucket name
    var bucket = new AWS.S3({
        params: {
            Bucket: bucketName
        }
    });
    var objKey = 'uploads/' + this.state.personDetails.email;
    var params = {
        Key: objKey,
        ContentType: file.type,
        Body: file,
        ACL: 'public-read'
    };

    let _this = this;
    bucket.putObject(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            _this.setState({uploadedFileName: file.name})
            console.log(data);
        }
        _this.setState({upload: false});
    });
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
        <div>
          <AppBar
            title="Blanco Client Onboarding System"
            showMenuIconButton={false}
          />
        <div style={{maxWidth: 600, maxHeight: 400, margin: 'auto'}}>
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
                  <div style={tablestyle}>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Salutation:</div>
                        <div style={cellstyle}>{this.state.personDetails.salutation}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>First Name:</div>
                        <div style={cellstyle}>{this.state.personDetails.first_name}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Last Name:</div>
                        <div style={cellstyle}>{this.state.personDetails.last_name}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Email:</div>
                        <div style={cellstyle}>{this.state.personDetails.email}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}></div>
                        <div style={cellstyle}></div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Address Line 1:</div>
                        <div style={cellstyle}>{this.state.personDetails.address_line_1}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Address Line 2:</div>
                        <div style={cellstyle}>{this.state.personDetails.address_line_2}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Postal Code:</div>
                        <div style={cellstyle}>{this.state.personDetails.postal_code}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>City:</div>
                        <div style={cellstyle}>{this.state.personDetails.city}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Country:</div>
                        <div style={cellstyle}>{this.state.personDetails.country.name}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Document Type:</div>
                        <div style={cellstyle}>{this.state.personDetails.document_type}</div>
                    </div>
                    <div style={rowstyle}>
                        <div style={cellstyle}>Document Number:</div>
                        <div style={cellstyle}>{this.state.personDetails.document_number}</div>
                        <div style={cellstyle}>
                          <IconButton href={`https://s3-eu-west-1.amazonaws.com/blanco-files/uploads/${this.state.personDetails.email}`} tooltip="View ID document"
                          tooltipPosition="bottom-center">
                          <FileIcon/>
                          </IconButton></div>
                    </div>
                  </div>
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
      </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
