import React from "react";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container'

import ServiceMenu from './ServiceMenu'

const ServiceSelection = (props) => {
  const items = props.services.items
  const cats = props.services.cats

  const handleSubmit = event => {
    props.onSubmit(1)
  }

  return (
    <Container maxWidth="md" style={{paddingTop: 20}}>
      {cats.map( cat => <ServiceMenu items={items} cat={cat} />)}
      <Button variant='contained' color='primary' onClick={handleSubmit}>
          Submit
      </Button>
    </Container>
  );
}

export default ServiceSelection
