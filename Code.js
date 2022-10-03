/**
 * Pseudo Code
 * Get the two sheets
 * Cycle through both sheets, doing the following:
 * Grab the amount, percentage, and confirmation
 * Multiple the amount by a .001 of the percentage
 * Add the amount to a "Total Owed" by the other person
 *
 * On the summary page, spew both of these "total oweds"
 * Subtract the lesser from the greater, and display below:
 * "Isaiah owes Daniel $100"
 */

function DualFinancing() {
  let sheets = {
    Daniel: SpreadsheetApp.getActive().getSheetByName("Daniel"),
    Isaiah: SpreadsheetApp.getActive().getSheetByName("Isaiah"),
    // Summary: SpreadsheetApp.getActive().getSheetByName("Summary"),
  };

  let columnIDs = {
    amount: 2,
    percentage: 3,
    confirmation: 4,
  };

  // I want a shit ton of numbers

  let owedTo = {
    Daniel: 0,
    Isaiah: 0,
  };

  let users = ["Daniel", "Isaiah"];

  users.forEach((user) => {
    let sheet = sheets[user];
    let nextRowHasData = true;
    let currentRow = 6;
    while (nextRowHasData) {
      if (!sheet.getRange(currentRow, columnIDs.amount).getValue()) {
        nextRowHasData = false;
        return;
      }

      let amount = parseFloat(
        sheet.getRange(currentRow, columnIDs.amount).getValue()
      );
      let multiplier = parseFloat(
        sheet.getRange(currentRow, columnIDs.percentage).getValue()
      );
      let confirmation = sheet
        .getRange(currentRow, columnIDs.confirmation)
        .getValue();
      let confirmed = confirmation == "Y" ? true : false;

      console.log("amount: " + amount);
      console.log("multiplier: " + multiplier);
      console.log("confirmation: " + confirmation);

      if (confirmed) {
        let calculatedAmount = amount * multiplier;
        owedTo[user] = owedTo[user] + calculatedAmount;
      }

      currentRow++;
    }
  });

  let brokenEven = false;

  let debt = {
    debtor: "",
    amount: 0,
  };

  if (owedTo.Daniel > owedTo.Isaiah) {
    debt.debtor = "Isaiah";
    debt.amount = owedTo.Daniel - owedTo.Isaiah;
  } else if (owedTo.Isaiah > owedTo.Daniel) {
    debt.debtor = "Daniel";
    debt.amount = owedTo.Isaiah - owedTo.Daniel;
  } else {
    brokenEven = true;
  }

  console.log(owedTo);
  console.log(debt);

  let totalCell; // Write this later. I need to get the cell and get the value to assign it in the below logic

  users.forEach((user) => {
    let sheet = sheets[user];

    if (debt.debtor == "Isaiah") {
      sheet.getRange(2, 1).setValue("Isaiah owes");
      sheet.getRange(3, 1).setValue("Daniel owes");
      sheet.getRange(2, 2).setValue(owedTo.Daniel);
      sheet.getRange(3, 2).setValue(owedTo.Isaiah);
      if (user == "Isaiah") {
        sheet.getRange(2, 4).setValue("You owe " + Math.round(debt.amount));
      } else {
        sheet.getRange(2, 4).setValue(Math.round(debt.amount) + " owed to you");
      }
    } else {
      sheet.getRange(2, 1).setValue("Daniel owes");
      sheet.getRange(3, 1).setValue("Isaiah owes");
      sheet.getRange(2, 2).setValue(owedTo.Isaiah);
      sheet.getRange(3, 2).setValue(owedTo.Daniel);
      if (user == "Daniel") {
        sheet.getRange(2, 4).setValue("You owe " + Math.round(debt.amount));
      } else {
        sheet.getRange(2, 4).setValue(Math.round(debt.amount) + " owed to you");
      }
    }
  });

  // if (!brokenEven) {
  //   totalCell = debt.debtor + " owes $" + debt.amount;
  // } else {
  //   totalCell = "You have broken even";
  // }
}
