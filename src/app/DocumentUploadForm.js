import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';

const items = [];
const documentTypes = ["National ID", "Pasport"];
for (let i = 0; i < documentTypes.length; i++ ) {
  items.push(<MenuItem value={i} key={i} primaryText={`${documentTypes[i]}`} />);
}

const styles = {
  block: {
    maxWidth: 250,
  },
  button: {
    margin: 12,
  },
  radioButton: {
    display: 'inline-block',
    marginBottom: 16,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  labelStyle: {
    color: '#000',
  }
};


class DocumentUploadForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {documentType: props['documentType']};
  }

  isValid() {
      return this.refs.document_number.getValue() !== "";
  }

  getUploadedDocument() {
    return {
      document_type: this.state.documentType,
      document_number: this.refs.document_number.getValue()
    }
  }

  getUploadedFileName() {
    return this.state.uploadedFileName;
  }

  fileAdded(event) {
    //console.log(this.refs.idfile.files[0]);
    this.props.idFileHandler(this.refs.idfile.files[0]);
  }

  handleDocumentTypeChange(event, index, value) {
    this.setState({documentType:value});
  }

  removeFile() {
    this.setState({uploadedFileName: ""})
  }

  onFieldChange(event, value) {
    let component = this.refs.document_number;
    if (value === "") {
      component.setState({errorText: "This field can not be empty"});
    } else {
      component.setState({errorText: null});
    }
  }

  render() {
    return (
      <div>
        <SelectField
          value={this.state.documentType || this.props.documentType}
          onChange={this.handleDocumentTypeChange.bind(this)}
          ref="document_type"
          floatingLabelText="Document Type" maxHeight={200}>
          {items}
        </SelectField><br />
        <TextField
          ref="document_number"
          floatingLabelText="Document Number"
          onChange={this.onFieldChange.bind(this)}
          defaultValue={this.props.documentNumber}
        /><br />
        <br />
        <RaisedButton
            label="Choose Document to Upload"
            labelPosition="before"
            style={styles.button}
          >
          <input onChange={this.fileAdded.bind(this)} ref="idfile" type="file" style={styles.exampleImageInput} />
          </RaisedButton>
        <br />
        <List style={{display: this.state.uploadedFileName || this.props.uploadedFileName ? 'block' : 'none'}}>
          <ListItem
            leftIcon={<FileAttachment />}
            rightIconButton={ <IconButton
                touch={true}
                tooltip="Remove File"
                tooltipPosition="bottom-left"
                onClick={this.removeFile.bind(this)}
              >
                <DeleteIcon/>
              </IconButton>
            }
            primaryText={this.state.uploadedFileName || this.props.uploadedFileName}
          />
        </List>
    </div>
    );
  }
}

export default DocumentUploadForm;
