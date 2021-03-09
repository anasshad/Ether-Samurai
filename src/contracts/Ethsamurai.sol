// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ethsamurai is ERC721 {
    address gameOwner;

    struct Samurai {
        string name;
        uint256 level;
    }

    Samurai[] public samurais;

    mapping(string => bool) public samuraiExists;

    event Attack(uint256 attackerId, uint256 defenderId);

    constructor() ERC721("EthSamurai", "ETS") {
        gameOwner = msg.sender;
    }

    function createSamurai(string memory _name, address _to) public {
        require(
            msg.sender == gameOwner,
            "New samurai can only be created by the game owner"
        );
        require(!samuraiExists[_name], "Samurai can only be added once");
        uint256 id = samurais.length;
        samurais.push(Samurai(_name, 1));
        samuraiExists[_name] = true;
        _safeMint(_to, id);
    }

    modifier onlyOwnerOf(uint256 _samuraiId) {
        require(
            ownerOf(_samuraiId) == msg.sender,
            "Must be the owner of samurai"
        );
        _;
    }

    function attack(uint256 _attacker, uint256 _defender)
        public
        onlyOwnerOf(_attacker)
    {
        Samurai storage attacker = samurais[_attacker];
        Samurai storage defender = samurais[_defender];

        if (attacker.level >= defender.level) {
            attacker.level += 2;
            defender.level += 1;
        } else {
            attacker.level += 1;
            defender.level += 2;
        }

        emit Attack(_attacker, _defender);
    }
}
