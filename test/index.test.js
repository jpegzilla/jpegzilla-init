const assert = require("assert");
const { expect } = require("chai");
const { argsGrinder: ag } = require("./../src/utils/argsgrinder.js");

describe("n-cli tests", () => {
  it("args-grinder returns an array", () => {
    const args = ag();
    expect(args).to.be.an("array");
  });
});
