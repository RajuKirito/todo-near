 use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
 use near_sdk::{env, log, AccountId, near_bindgen};
 use near_sdk::collections::{UnorderedMap, LookupMap};
 use near_sdk::serde::{Deserialize, Serialize};

 //Define the Todo
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]  
#[serde(crate = "near_sdk::serde")]
#[derive(Debug)]
pub struct Todo{
    pub content: String,
    pub finished: bool
}

 // Define the User message
#[derive(BorshDeserialize, BorshSerialize)]
pub struct User{
    pub todos: UnorderedMap<String, Todo>,
}
 
 // Define the contract structure
 #[near_bindgen]
 #[derive(BorshDeserialize, BorshSerialize)]
 pub struct Contract {
     users: LookupMap<AccountId,User>,
 }
 
 // Define the default, which automatically initializes the contract
 impl Default for Contract{
     fn default() -> Self{
         Self{users: LookupMap::new(b"r")}
     }
 }
 
 // Implement the contract structure
 #[near_bindgen]
 impl Contract {

    //method - adds todo
    pub fn add_todo(&mut self, content: String){

        let account = env::predecessor_account_id();

        // let id = uuid::Uuid::new_v4().simple().to_string();
        // let charset = "1234567890abcdefghijklmnopqrstuvwxyz";
        // let id =  generate(12, charset);
        let time = env::block_timestamp_ms().to_string();
        let id = account.to_string()+&content+&time.to_string();
        
        if let Some(mut user) = self.users.get(&account) {   
            
            let mut todo = Todo{
                content:content,
                finished:false
            };   

            user.todos.insert(&id,&todo);
            self.users.insert(&account,&user);
        }else{
            
            let mut user = User{
                todos: UnorderedMap::new(b"s")
            };

            let mut todo = Todo{
                content:content,
                finished:false,
            };

            user.todos.insert(&id,&todo);

            self.users.insert(&account,&user);
    
        }
    }
    
    //method - removes todo
    pub fn remove_todo(&mut self, id: String){

        let account = env::predecessor_account_id();

        if let Some(mut user) = self.users.get(&account) {

             if let None = user.todos.remove(&id){
                 panic!("You don't have a todo with this id");
             }else{
                 self.users.insert(&account,&user);
           }

        }
        else{
            panic!("You don't have an account");
        }

    }

    //method - updates todo
    pub fn update_todo(&mut self, id: String){

        let account = env::predecessor_account_id();

        if let Some(mut user) = self.users.get(&account) {

             if let Some(todo) = user.todos.get(&id){
                let fin = todo.finished;
                let mut newTodo = Todo{
                    content:todo.content,
                    finished: !fin,
                };
                user.todos.insert(&id,&newTodo);
                self.users.insert(&account,&user);
             }
             else{
                panic!("You don't have a todo with this id");
             }

        }
        else{
            panic!("You don't have an account");
        }
    }    

    //method - reads todo
    pub fn get_todos(&self) -> Vec<(String,Todo)>{
        
        let account = env::predecessor_account_id();

        if let Some(user) = self.users.get(&account){

            // for k in user.todos.keys() {

            //     let todo = &user.todos;
            //     ret.push((k.clone(),todo.get(&k).unwrap()));

            // }
            return user.todos.to_vec();

        }else{
            return Vec::new();
        }

        // return ret;
            
    }
     // Public method - returns the greeting saved, defaulting to DEFAULT_MESSAGE
     pub fn get_greeting(&self) -> String {
         return "Hello".to_string();
     }
 
     // Public method - accepts a greeting, such as "howdy", and records it
    //  pub fn set_greeting(&mut self, message: String) {
    //      // Use env::log to record logs permanently to the blockchain!
    //      log!("Saving greeting {}", message);
    //      self.message = message;
    //  }
 }
 
 /*
  * The rest of this file holds the inline tests for the code above
  * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
  */
 #[cfg(test)]
 mod tests {
     use super::*;
    // use near_sdk::test_utils::VMContextBuilder;
    // use near_sdk::{testing_env, AccountId};
 
    //  fn get_context(predecessor: AccountId) -> VMContextBuilder {
    //     let mut builder = VMContextBuilder::new();
    //     builder.predecessor_account_id(predecessor);
    //     builder
    // }

    #[test]
    pub fn add_todo(){
        // Set up contract object and call the new method
        let mut contract = Contract::default();

        contract.add_todo("hello".to_string());
        contract.add_todo("hlo".to_string());
        let res = contract.get_todos();
        log!("{:#?}",res);
        assert_eq!("hello".to_string(),res[0].1.content);
        assert_eq!("hlo".to_string(),res[1].1.content);
        assert_eq!(false,res[0].1.finished);

    }

    #[test]
    pub fn update_todo(){
        // Set up contract object and call the new method
        let mut contract = Contract::default();

        contract.add_todo("hello".to_string());
        let res = contract.get_todos();
        let id = res[0].0.clone();

        contract.update_todo(id);
        let result = contract.get_todos();
        log!("{:#?}",result);

        assert_eq!(result[0].1.finished,true);
    }

    #[test]
    pub fn remove_todo(){
        // Set up contract object and call the new method
        let mut contract = Contract::default();

        contract.add_todo("hello".to_string());
        contract.add_todo("hlo".to_string());
        let res = contract.get_todos();
        let id = res[0].0.clone();

        contract.remove_todo(id);
        let result = contract.get_todos();
        log!("{:#?}",result);

        assert_eq!(result.len(),1);
    }
 }
 