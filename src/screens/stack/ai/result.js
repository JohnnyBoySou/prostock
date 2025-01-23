import React, { useState, useRef, useEffect } from 'react';
import { Pressable } from 'react-native';
import { Main, Column, Label, Title, Button, Image, SCREEN_WIDTH, SCREEN_HEIGHT, colors, Loader, Row, ListSearchIA, ScrollVertical } from '@/ui';
import { Check, Flashlight, SwitchCamera, FlashlightOff, Truck, LayoutGrid } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { searchSupplier,} from '@/api/supplier';
import { searchProduct,} from '@/api/product';

import { ProductEmptyIA } from '@/ui/Emptys/product_ia';
import { SupplierEmptyIA } from '@/ui/Emptys/supplier_ia';
import { useNavigation } from '@react-navigation/native';

export default function AIResultScreen({ navigation, route }) {

  const [fornecedor, setfornecedor] = useState();
  const [produto, setproduto] = useState();
 const data = route?.params?.data
  
  /*
  const data = {
    cnpj: "111.111.111-11",
    razaosocial: "Nova era",
    endereco: "Rua dos Vinhedos, 386",
    cep: "89251-300",
    bairro: "Vinhedos",
    municipio: "Bento Gonçalves",
    telefone: "3454-6877",
    email: null,

    nome1: "Uva",
    preco1: "45,00",
    quantidade1: "3",
    unidade1: "CX"
  }
  */
  const fornecedorData = {
    cnpj: data?.cnpj,
    razaosocial: data?.razaosocial,
    endereco: data?.endereco,
    cep: data?.cep,
    bairro: data?.bairro,
    municipio: data?.municipio,
    telefone: data?.telefone,
    email: data?.email
  }

  const produtoData = {
    nome: data?.nome1,
    preco: data?.preco1,
    quantidade: data?.quantidade1,
    unidade: data?.unidade1
  }

  const moveData = {
    fornecedor_id: fornecedor,
    fornecedor: fornecedorData?.razaosocial,
    produto_id: produto,
    produto: produtoData?.nome,
    quantidade: data?.quantidade1,
    preco: data?.preco1,
    unidade: data?.unidade1
  }
  //DEVE BUSCAR SE TEM FORNECEDOR, SE NÃO TIVER DEVE CRIAR
  //DEVE BUSCAR SE TEM PRODUTO, SE NÃO TIVER DEVE CRIAR
  //DEVE BUSCAR SE TEM MOVIMENTO, SE NÃO TIVER DEVE CRIAR

  return (
    <Main >
      <ScrollVertical>
        <Column gv={8}>
          <Image src={require('@/imgs/ia.png')} w={100} h={100} />
          <Column style={{ backgroundColor: '#3590F3', borderRadius: 6, alignSelf: 'center' }} align='center' justify='center' pv={8} ph={8}>
            <Label color='#fff' size={12} style={{ marginTop: 2, }}>Inteligência Artificial</Label>
          </Column>
          <Label size={24} align='center'>Veja o que encontramos:</Label>
        </Column>

        <SupplierList fornecedor={fornecedor} setfornecedor={setfornecedor} defaultValue={fornecedorData?.razaosocial} fornecedorData={fornecedorData} />
        <ProductList produto={produto} setproduto={setproduto} defaultValue={produtoData?.nome} produtoData={produtoData} />

      </ScrollVertical>
      <Column style={{ position: 'absolute', bottom: 30, alignSelf: 'center', left: 26, right: 26, }} ph={26}>
        {fornecedor && produto && <Button label='Criar movimentação' onPress={() => { navigation.navigate('MoveAdd', { data: moveData }) }}/>}
        {fornecedor && !produto && <Button label='Criar produto' onPress={() => { navigation.navigate('ProductAdd', { data: produtoData }) }} />}
        {!fornecedor && produto && <Button label='Criar fornecedor' onPress={() => { navigation.navigate('SupplierAdd', { data: fornecedorData }) }} />}
        {!fornecedor  && !produto && <Button label='Tentar novamente' onPress={() => { navigation.navigate('OCR', { data: fornecedorData }) }} />}
      </Column>
    </Main>
  );
}

const SupplierList = ({ fornecedor, setfornecedor, defaultValue, fornecedorData }) => {
  const navigation = useNavigation();
  const Card = ({ item }) => {
    if (!item) return null;
    const { id, status, cep, cidade, cnpj, email, endereco, estado, telefone, cpf_responsavel, email_responsavel, id_loja, nome_fantasia, nome_responsavel, telefone_responsavel } = item;
    return (
      <Pressable onPress={() => { setfornecedor(fornecedor === id ? '' : id) }} >
        <Row pv={16} justify="space-between" ph={12} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8, borderWidth: 3, borderColor: fornecedor == id ? colors.color.blue : '#fff' }}>
          <Column gv={6}>
            <Title size={20} fontFamily='Font_Medium'>{nome_fantasia?.length > 16 ? nome_fantasia?.slice(0, 16) + '...' : nome_fantasia}</Title>
            <Label>{cidade} • {status} </Label>
          </Column>
          <Column style={{ width: 42, height: 42, backgroundColor: fornecedor == id ? colors.color.blue : '#fff', borderRadius: 100, }} align='center' justify='center' >
            <Check color='#fff' />
          </Column>
        </Row>
      </Pressable>
    )
  }
  return (
    <Column mh={26} mv={12}>
      <Title size={24}>Fornecedores</Title>
      <ListSearchIA defaultValue={defaultValue}
        id="list ia supplier"
        top spacing={true}
        refresh={false}
        renderItem={({ item }) => <Card item={item} />}
        getSearch={searchSupplier}
        empty={<Column>
          <Column style={{ backgroundColor: '#fff', borderRadius: 12, }} pv={20} ph={20} justify='center' gv={12}>
            <Title align='center' color='#303030' size={18} fontFamily="Font_Book">Não encontramos nenhum fornecedor com esse nome. Deseja criar um novo utilizando os dados fornecidos?</Title>
            <Pressable onPress={() => {navigation.navigate('SupplierAdd', { data: fornecedorData})}}  style={{ backgroundColor: colors.color.blue, padding: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center',  }}>
              <Label color='#fff' fontSize={18} fontFamily="Font_Medium">Criar fornecedor</Label>
            </Pressable>
          </Column>
        </Column>} />
    </Column>
  )
}
const ProductList = ({ produto, setproduto, defaultValue, produtoData }) => {
  const navigation = useNavigation();
  const Card = ({ item }) => {
    if (!item) return null;
    const { id, status, estoque_minimo, estoque_maximo, nome, unidade, } = item;
    const isSelect = produto === id;
    return (
      <Pressable onPress={() => { setproduto(isSelect ? '' : id) }} >
        <Row pv={16} justify="space-between" ph={12} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8, borderWidth: 3, borderColor: isSelect ? colors.color.blue : '#fff' }}>
          <Column gv={6}>
            <Title size={20} fontFamily='Font_Medium'>{nome} ({unidade})</Title>
            <Label>{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</Label>
          </Column>
          <Column style={{ width: 42, height: 42, backgroundColor: isSelect ? colors.color.blue : '#fff', borderRadius: 100, }} align='center' justify='center' >
            <Check color='#fff' />
          </Column>
        </Row>
      </Pressable>
    )
  }
  return (
    <Column mh={26} mv={12}>
      <Title size={24}>Produtos</Title>
      <ListSearchIA defaultValue={defaultValue}
        id="list ia product"
        top spacing={true}
        renderItem={({ item }) => <Card item={item} />}
        getSearch={searchProduct}
        refresh={false}
        empty={<Column>
          <Column style={{ backgroundColor: '#fff', borderRadius: 12, }} pv={20} ph={20} justify='center' gv={12}>
            <Title align='center' color='#303030' size={18} fontFamily="Font_Book">Não encontramos nenhum produto com esse nome. Deseja criar um novo utilizando os dados fornecidos?</Title>
            <Pressable onPress={() => {navigation.navigate('ProductAdd', { data: produtoData})}}  style={{ backgroundColor: colors.color.yellow, padding: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center',  }}>
              <Label color='#fff' fontSize={18} fontFamily="Font_Medium">Criar produto</Label>
            </Pressable>
          </Column>
        </Column>} />
    </Column>
  )
}
