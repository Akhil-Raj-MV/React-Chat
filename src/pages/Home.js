import React from 'react'
import {Grid,Row,Col} from 'rsuite'
import Siderbar from '../components/Siderbar'

const Home = () => {
  return (
    <div>
      <Grid fluid className='h-100'>
      <Row>
        <Col xs={24} md={8}>
          <Siderbar/>
        </Col>
      </Row>
    </Grid>
  </div>
  )
}

export default Home