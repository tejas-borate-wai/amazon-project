import { formatCurrency } from "../scripts/utils/currency_converter.js";

describe("test suite : format currency", () => {
  it("converyt cents into doller", () => {
    expect(formatCurrency(2095)).toEqual("20.95");
  });

  it("works with 0", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });

  it("round up the nearest cents", () => {
    expect(formatCurrency(2000.5)).toEqual("20.01");
  });
});
