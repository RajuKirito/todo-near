import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');
  const alice = await root.createSubAccount('alice');
  const bob = await root.createSubAccount('bob');
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(
    process.argv[2],
  );

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice, bob };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

// test('returns the default greeting', async (t) => {
//   const { contract } = t.context.accounts;
//   const message: string = await contract.view('get_greeting', {});
//   t.is(message, 'Hello');
// });

test('changes the messages', async (t) => {
  const { root, contract, alice, bob } = t.context.accounts;
  await alice.call(contract, 'set_greeting', { message: 'Howdy alice' });
  const message: string = await alice.call(contract,'get_greeting', {});
  console.log(message);
  await bob.call(contract, 'set_greeting', { message: 'Howdy bob' });
  const bob_message: string = await bob.call(contract,'get_greeting', {});
  console.log(bob_message);
  
  t.is(message, 'Howdy');
});