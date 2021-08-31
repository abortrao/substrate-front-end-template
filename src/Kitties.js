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

    // todo js不太熟悉,重心没在这上面
    api.query.kittiesModule.kittiesCount().then(currentIndex => {
      for (let index = 1; index <= currentIndex; index++) {
        let kittyDna = ''
        let kittyOwner = ''
        api.query.kittiesModule.kittiesIdMap(index).then(dna => {
          kittyDna = dna.toString()
          api.query.kittiesModule.kittiesOwnerMap(index).then(owner => {
            kittyOwner = owner.toString()
            // console.log('kitty info: ', index, kittyDna, kittyOwner)
            if (kittyDna == '' || kittyOwner == '') {
              return
            }
            kitties.push({
              id: parseInt(index),
              dna: kittyDna,
              owner: kittyOwner
            })
            if (index == currentIndex) {
              // setKitties(kitties)
              updateData(kitties, kitties)
            }
          })
        })

      }
    })

    api.query.kittiesModule.kittiesCount(index => {
      if (index == 0) {
        return
      }
      let newKitties = []
      let kittyDna = ''
      let kittyOwner = ''
      api.query.kittiesModule.kittiesIdMap(index.toString()).then(value => {
        kittyDna = value.toString()
        api.query.kittiesModule.kittiesOwnerMap(index.toString()).then(value => {
          kittyOwner = value.toString()
          if (kittyDna == '' || kittyOwner == '') {
            return
          }
          newKitties.push({
            id: parseInt(index),
            dna: kittyDna,
            owner: kittyOwner
          })
          updateData(kitties, newKitties)
        })
      })
    })

  }

  function updateData (newKitties, kitties) {
    for (let i = 0; i < kitties.length; i++) {
      let kitty = kitties[i]
      if (!isContain(newKitties, kitty.id)) {
        newKitties.push(kitty)
      }
    }
    setKitties(newKitties)
  }

  function isContain (kitties, id) {
    for (let j = 0; j < kitties.length; j++) {
      if (kitties[j].id == id) {
        return true
      }
    }
    return false
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
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX'
          setStatus={setStatus}
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
