import { React, Component } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

class CampaignRequestsNew extends Component {
  state = {
    description: "",
    receiver: "",
    value: "",
    errorMessage: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const address = props.query.address;
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    console.log(this.props.address);
    const campaign = Campaign(this.props.address);

    try {
      console.log("here it is");
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.value, "ether"),
          this.state.receiver
        )
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
            <Button primary>Back</Button>
          </a>
        </Link>
        <h3> Create Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Receiver</label>
            <Input
              value={this.state.receiver}
              onChange={(event) =>
                this.setState({ receiver: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignRequestsNew;
