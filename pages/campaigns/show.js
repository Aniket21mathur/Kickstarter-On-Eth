import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Button, Card, Grid, GridColumn } from "semantic-ui-react";
import { Link } from "../../routes";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const info = await campaign.methods.getContractDetails().call();

    return {
      address: props.query.address,
      minimumContribution: info[0],
      balance: info[1],
      requestCount: info[2],
      approversCount: info[3],
      manager: info[4],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestCount,
      approversCount,
      manager,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and has the power to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum contribution(wei)",
        description: "The minimum money required to contribute to the campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of contributors",
        description:
          "Number of people who have already donated to this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Balance of the campaign",
        description: "Balance of the campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestCount,
        meta: "Number of requests",
        description:
          "A request ries to withdraw money from the contract. Requests must be approved by approers",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign show</h3>
        <Grid>
          <Grid.Row>
            <GridColumn width={10}> {this.renderCards()}</GridColumn>
            <GridColumn width={6}>
              <ContributeForm address={this.props.address} />
            </GridColumn>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <Button primary>View Requests</Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
