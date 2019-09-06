import React from 'react';
import './Login.css';

import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  TextArea,
  Icon,
  Label,
  Dropdown,
  Message,
  Divider,
  Input,
  Select
} from 'semantic-ui-react';

const orgOptions = [
  { key: 'fl', value: 'fl', text: 'Finance' },
  { key: 'mj', value: 'mj', text: 'Monk' }
  
]

 
export default () => (
  <Grid centered columns={1}>
    <Grid.Column computer={10} mobile={15}> 
      <Header as="h2" textAlign="center" textColor="white">
        <Icon name = "mail" />
        Bulk Email Solution
      </Header>
      <Message
      atached header='Welcome to our site!'
      content='Fill out the form and attach Recipient List to send emails to multiple recipients'
    />
    <Segment raised>
    <Form action="http://127.0.0.1:8081/send" method="POST" encType="multipart/form-data" >
        <Label as='a' color='red' ribbon>
          ORGANZATION:
        </Label>
        <Form.Input
        placeholder='Select Organization Name' name="organisationName" type="text" icon="building" iconPosition="left" />

          <Label as='a' color='red' ribbon>
          SUBJECT:
          </Label>

          <Form.Input
            fluid
            placeholder="Enter the subject of Email here"
            iconPosition="left"
            icon="edit outline"
            name="subject" 
        
          />
        <Label as='a' color='red' ribbon >
          BODY:
        </Label>
          <Form.TextArea
            fluid
            placeholder="Enter the body of Email here"
            rows="6"
            name="body"
          />
        <Label as='a' color='red' ribbon>
          ATTACHMENT:
        </Label>
          <Form.Input
            fluid
            type="file"
            name="attachment"
          />

        <Label as='a' color='red' ribbon>
          SELECT EMAIL-ID:
        </Label>
        <Form.Input
          fluid
          type="text"
          name="email"
          placeholder="Enter Email-id"
          icon="envelope outline"
          iconPosition="left"
        /> 
        <Label as='a' color='red' ribbon>
          RECIPIENT LIST:
        </Label>
          <Form.Input
            fluid
            type="file"
            name="csvFileEmail" 
          />
        
          <br />
        <Form.Button animated='fade' color="green" size="large" fluid type="submit" >
          <Button.Content hidden>SEND</Button.Content>
          <Button.Content visible>
            <Icon name='paper plane' />
          </Button.Content>
        </Form.Button>
      </Form><br />
    </Segment>
    <Segment inverted>
      <Header as="h4" textAlign="center">
        <Icon name = "code" />
        Developed by Jigar & Sanil 
      </Header>
      <a href="https://www.linkedin.com/in/jigar98/"><Header as="h5" textAlign="left" inverted>
        <Icon name = "linkedin" size="big"/>
        Aditya Sanil
      </Header></a><br/>

      <a href="https://www.linkedin.com/in/jigar98/"><Header as="h5" textAlign="left" inverted>
        <Icon name = "linkedin" size="big" />
        Jigar Thakkar
      </Header></a>
    </Segment>
    </Grid.Column>
  </Grid>
);