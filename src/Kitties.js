import React, { useEffect, useState } from 'react'
import { Form, Grid } from 'semantic-ui-react'

import { useSubstrate } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

import KittyCards from './KittyCards'

export default function Kitties (props) {
  const {
    api,
    keyring
  } = useSubstrate()
  const { accountPair } = props

  const [kitties, setKitties] = useState([])
  const [status, setStatus] = useState('')

  const fetchKitties = () => {
    // TODO: 在这里调用 `api.query.kittiesModule.*` 函数去取得猫咪的信息。
    // 你需要取得：
    //   - 共有多少只猫咪
    //   - 每只猫咪的主人是谁
    //   - 每只猫咪的 DNA 是什么，用来组合出它的形态

    api.query.kittiesModule.kittiesCount().then(currentIndex => {
      for (let index = 0; index <= currentIndex; index++) {
        let kittyDna = ''
        let kittyOwner = ''
        api.query.kittiesModule.kittiesIdMap(index).then(value => {
          kittyDna = JSON.stringify(value)
          api.query.kittiesModule.kittiesOwnerMap(index).then(value => {
            kittyOwner = JSON.stringify(value)
            console.log('kitty info: ', index, kittyDna, kittyOwner)
            kitties.push({
              id: index,
              dna: kittyDna,
              owner: kittyOwner
            })
            if (index == currentIndex) {
              console.log('end')
              setKitties(kitties)
            }
          })
        })

      }
    })

    console.log('fetch info')

  }

  const populateKitties = () => {
    // TODO: 在这里添加额外的逻辑。你需要组成这样的数组结构：
    //  ```javascript
    //  const kitties = [{
    //    id: 0,
    //    dna: ...,
    //    owner: ...
    //  }, { id: ..., dna: ..., owner: ... }]
    //  ```
    // 这个 kitties 会传入 <KittyCards/> 然后对每只猫咪进行处理
    const kitties = []
    setKitties(kitties)
    console.log('populateKitties info')
  }

  useEffect(fetchKitties, [api, keyring])
  useEffect(populateKitties, [])

  return <Grid.Column width={16}>
    <h1>小毛孩</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩（等6秒请刷新一下页面,就能看到创建的小猫,react不会)' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>
}
