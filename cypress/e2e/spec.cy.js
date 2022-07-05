describe("visit train exits", () => {
  it("passes", () => {
    cy.visit("/");
  });
});

describe("click to view start station options", () => {
  it("can view options", () => {
    cy.get("#startStation").click();
  });
});

describe("select one of the start station options", () => {
  it("can select start station", () => {
    cy.get(
      " #react-select-3-listbox > .css-4ljt47-MenuList > #react-select-3-option-0"
    ).click();
  });
  it("can check the option is selected", () => {
    cy.get(".css-qc6sy-singleValue").contains("Acton Town");
  });
});

describe("click to view end station options", () => {
  it("can view options", () => {
    cy.get("#endStation").click();
  });
});

// describe("select one of the end station options", () => {
//   it("can select end station", () => {
//     cy.get(
//       "  > .css-4ljt47-MenuList > #react-select-3-option-0"
//     ).click();
//   });
//   it("can check the option is selected", () => {
//     cy.get(".css-qc6sy-singleValue").contains("Acton Town");
//   });
// });

// start station click select
describe("click to view options", () => {
  it("can view options", () => {
    cy.get("#startStation").click();
  });
});

describe("select one of the start station options", () => {
  it("can select options", () => {
    cy.get(
      " #react-select-3-listbox > .css-4ljt47-MenuList > #react-select-3-option-0"
    ).click();
  });
  it("can check the option is selected", () => {
    cy.get(".css-qc6sy-singleValue").contains("Acton Town");
  });
});

describe("type station name and select one of the searched results", () => {
  it("type station name", () => {
    cy.get("#startStation").type("Ang");
  });
  it("view related searched results", () => {
    cy.get("#react-select-3-listbox")
      .find(".css-4ljt47-MenuList")
      .find("div")
      .first()
      .contains("Angel");
  });
  it("can select one of the options", () => {
    cy.get("#react-select-3-option-5").click();
  });
  it("can check selected option", () => {
    cy.get(".css-qc6sy-singleValue").contains("Angel");
  });
});

//end station click select
describe("click to view end station options", () => {
  it("can view options", () => {
    cy.get("#endStation").click();
  });
});

describe("select one of the end station options", () => {
  it("can select end station", () => {
    cy.get(
      " #react-select-5-listbox > .css-4ljt47-MenuList > #react-select-5-option-8"
    ).click();
  });
  it("can check the option is selected", () => {
    cy.get(".css-qc6sy-singleValue").contains("Arsenal");
  });
});


// start station type select

// end station type select