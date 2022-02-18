pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minAmount) public {
        address newCampaign = new Campaign(minAmount, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address receiver;
        bool complete;
        mapping(address => bool) isVoted;
        uint256 approvalCount;
    }

    Request[] public requests;
    address public manager;
    uint256 public minAmount;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minAmountSend, address sender) public {
        manager = sender;
        minAmount = minAmountSend;
    }

    function contribute() public payable {
        require(msg.value > minAmount);
        approvers[msg.sender] = true;
    }

    function createRequest(
        string description,
        uint256 value,
        address receiver
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            receiver: receiver,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 requestIndex) public {
        Request storage request = requests[requestIndex];

        require(approvers[msg.sender]);
        require(!request.isVoted[msg.sender]);

        request.approvalCount++;
        request.isVoted[msg.sender] = true;
    }

    function finalizeRequest(uint256 requestIndex) public restricted {
        Request storage request = requests[requestIndex];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.receiver.transfer(request.value);
        request.complete = true;
    }
}
