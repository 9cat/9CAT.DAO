import React from 'react'
import { useBlockMeta, useBlockNumber, useEthers } from '@usedapp/core'
import { Container, ContentBlock, ContentRow, MainContent, Section } from '../components/base/base'
import { Label } from '../typography/Label'
import { TextInline } from '../typography/Text'

export function Block() {
  const blockNumber = useBlockNumber()
  const { chainId } = useEthers()
  const { timestamp, difficulty } = useBlockMeta()
  return (
    <MainContent>
      <Container>
        <Section>
          <ContentBlock>
            <ContentRow>
              <Label>区块链编号[1=以太坊 | 70=HSC链 | 56=BSC链 ]:</Label> <TextInline>{chainId}</TextInline>
            </ContentRow>
            <ContentRow>
              <Label>当前区块高度:</Label> <TextInline>{blockNumber}</TextInline>
            </ContentRow>
            {difficulty && (
              <ContentRow>
                <Label>当前区块难度:</Label> <TextInline>{difficulty.toString()}</TextInline>
              </ContentRow>
            )}
            {timestamp && (
              <ContentRow>
                <Label>当前区块时间:</Label> <TextInline>{timestamp.toLocaleString()}</TextInline>
              </ContentRow>
            )}
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}
