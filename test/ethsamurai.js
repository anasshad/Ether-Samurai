const { assert } = require("chai");

const Ethsamurai = artifacts.require("Ethsamurai");

contract("Ethsamurai", function(accounts) {
  let contract, owner;

  before(async () => {
    contract = await Ethsamurai.deployed();
    owner = await accounts[0];
  });

  describe("Deployment", async () => {
    it("should have a name", async () => {
      const name = await contract.name();
      assert.equal(name, "EthSamurai", "name of contract should be correct");
    });

    it("should have a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "ETS", "symbol of contract should be contract");
    });
  });

  describe("Minting", async () => {
    it("should create a new samurai", async () => {
      const result = await contract.createSamurai("Sam", accounts[0]);
      const totalSupply = await contract.totalSupply();
      //SUCCESS
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 0, "id is correct");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "from address is correct"
      );
      assert.equal(event.to, accounts[0], "to is correct");
    });
  });

  describe("Indexing", async () => {
    it("lists samurais", async () => {
      //Create 3 Samurais
      await contract.createSamurai("Jack", accounts[0]);
      await contract.createSamurai("Sparrow", accounts[0]);
      await contract.createSamurai("Robin", accounts[0]);
      const totalSupply = await contract.totalSupply();

      let samurai;
      let result = [];

      for (var i = 1; i <= totalSupply; i++) {
        samurai = await contract.samurais(i - 1);
        result.push(await samurai[0]);
      }

      let expected = ["Sam", "Jack", "Sparrow", "Robin"];
      assert.equal(result.join(","), expected.join(","));
    });
  });

  describe("Attacking", async () => {
    it("attacks", async () => {
      await contract.attack(1, 2, { from: accounts[0] });
      let attackerLevel = await contract.samurais(1);
      let defenderLevel = await contract.samurais(2);
      assert.equal(
        attackerLevel[1].toNumber(),
        3,
        "Attacker level should be correct"
      );
      assert.equal(
        defenderLevel[1].toNumber(),
        2,
        "Defender level should be correct"
      );
    });
  });
});
