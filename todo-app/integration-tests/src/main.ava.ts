import { Worker, NearAccount } from "near-workspaces";
import anyTest, { TestFn } from "ava";

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount("test-account");

  //create alice and bob
  const alice = await root.createSubAccount("alice");
  const bob = await root.createSubAccount("bob");

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice, bob };

  // await contract.view("get_greeting", {});

  // console.log(contract);
});

test.afterEach(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("gets the greeting", async (t) => {
  const { contract, alice } = t.context.accounts;
  // await alice.call(contract, "add_todo", { content: "Howdy" });
  // console.log(contract);

  const message: string = await contract.view("get_greeting", {});
  t.is(message, "Hello");
});

test("adds a todo", async (t) => {
  const { contract, alice } = t.context.accounts;
  await alice.call(contract, "add_todo", { content: "Howdy" });
  await alice.call(contract, "add_todo", { content: "hola" });
  // console.log(contract);

  const message:[string,string][] = await alice.call(contract,"get_todos", {});
  console.log(message);
  // t.is(message[0], "1");
  // t.is(1,1);
});

test("updates a todo", async (t) => {
  const { contract, alice } = t.context.accounts;
  await alice.call(contract, "add_todo", { content: "Howdy" });
  await alice.call(contract, "add_todo", { content: "hola" });
  // console.log(contract);

  const message:[string,JSON][] = await alice.call(contract,"get_todos", {});
  const id = message[0][0];

  await alice.call(contract, "update_todo", {id:id});

  const res = await alice.call(contract,"get_todos", {});

  console.log(res);
  
  // t.is(message[0], "1");
  // t.is(1,1);
})

test("removes a todo", async (t) => {
  const { contract, alice } = t.context.accounts;
  await alice.call(contract, "add_todo", { content: "Howdy" });
  await alice.call(contract, "add_todo", { content: "hola" });
  // console.log(contract);

  const message:[string,JSON][] = await alice.call(contract,"get_todos", {});
  const id = message[0][0];

  await alice.call(contract, "remove_todo", {id:id});

  const res = await alice.call(contract,"get_todos", {});

  console.log(res);
  
  // t.is(message[0], "1");
  // t.is(1,1);
})

test("returns empty array for unknown account", async (t) => {
  const { contract, alice } = t.context.accounts;
  // console.log(contract);

  const message = await alice.call(contract,"get_todos", {});

  // const res = await alice.call(contract, "get_todos", {});

  console.log(message);
  
  // t.is(message[0], "1");
  // t.is(1,1);
})
// test('changes the message', async (t) => {
//   const { root, contract } = t.context.accounts;
//   await root.call(contract, 'set_greeting', { message: 'Howdy' });
//   const message: string = await contract.view('get_greeting', {});
//   t.is(message[1], 'Howdy');
// });
