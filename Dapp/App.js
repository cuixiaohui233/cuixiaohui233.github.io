import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

// 存储合约的地址
const contractAddress = "0x79670063052b240a2b4bc67fd4cbc72c08b6ddbb";

// 合约实例
const simpleStorageInstance = null;
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      inputVal:''
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    // 获取 web3 的实例
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    // web3
    const { web3 } = this.state;
    // 引用 truffle-contract
    const contract = require('truffle-contract')
    // 通过 abi 初始化合约对象
    const simpleStorage = contract(SimpleStorageContract)
    // 连接到以太坊的节点
    simpleStorage.setProvider(web3.currentProvider)

    // 获取账户列表.异步的
    web3.eth.getAccounts((error, accounts) => {
      console.log('账户列表')
      simpleStorage.at(contractAddress).then((instance) => {
        simpleStorageInstance = instance
        console.log('合约实例创建成功');
        // 调用合约中的 set() 方法,设置一个值
        // return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // 调用合约中的 get() 方法,获取值
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // 改变前端视图
        console.log(result);
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

oninputchange = (value) => {
  this.setState({
    inputVal:value
  })
}

writeAndsetNumber = () => {
  const { inputVal } = this.state;
  console.log(inputVal);
  simpleStorageInstance.set(inputVal, {from: this.state.web3.eth.accounts[0]});
}
  render() {
    return (
      <div className="App">
        <div>cxh肝的第一个以太坊小demo</div>
        <main className="container">
          <div className="pure-g">
            <input
              type="text"
              value={this.state.storageValue}
              onChange={this.oninputchange}
            />
            <button
              onClick={this.writeAndsetNumber}
              >点击设置介个数字</button>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
