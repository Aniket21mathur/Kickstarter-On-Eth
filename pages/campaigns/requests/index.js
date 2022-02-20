import { React, Component } from "react";
import { Button, Tab, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class CampaignRequests extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approvers = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return {
      address: props.query.address,
      requests: requests,
      requestCount: requestCount,
      approvers: approvers,
    };
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approvers}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h1>Requests page</h1>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Create Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Id</HeaderCell>
              <HeaderCell>Desceiption</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approvers Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests</div>
      </Layout>
    );
  }
}

export default CampaignRequests;
