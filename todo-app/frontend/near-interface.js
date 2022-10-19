/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class HelloNEAR {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async add_todo(content) {
    const res = await this.wallet.callMethod({
      contractId: this.contractId,
      method: "add_todo",
      args: { content: content }
    });
    return res;
  }

  async get_todos() {
    const res = await this.wallet.callMethod({
      contractId: this.contractId,
      method: "get_todos",
      args: {}
    });
    return res;
  }

  async update_todo(id) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: "update_todo",
      args: { id: id }
    });
  }

  async delete_todo(id) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: "remove_todo",
      args: { id: id }
    });
  }

  async get_greeting() {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: "get_greeting",
      args: {}
    });
  }
}
