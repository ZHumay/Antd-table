import { Button,Modal, Table } from 'antd';
import axios from 'axios';
import { ExclamationCircleFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import "../Antd/Antd.css"
const { confirm } = Modal;


function AntdTable() {
    const[orders,setorders]=useState([])
    const [customerIdFilters, setCustomerIdFilters] = useState([]);
// const[loading,setloading]=useState(true)
 

useEffect(()=>{
    loadData()
  },[])

  const loadData = () => {
    axios.get('https://northwind.vercel.app/api/orders').then((res) => {
      setorders(res.data);
    //   console.log(res.data);

      const uniqueCustomers = Array.from(new Set(res.data.map((item) => item.customerId)));
      //not:new Set(...) ifadesi, bu dizideki benzersiz değerleri içeren bir Set nesnesi oluşturur. 
      //Set nesnesi, yalnızca benzersiz değerlere izin verir ve her bir değeri yalnızca bir kez içerir. 
      //Örneğin, [1, 2, 3, 4] gibi bir Set nesnesi(obyekti) elde edilir.
      //Array.from(...) ifadesi, Set nesnesini temel alarak yeni bir dizi oluşturur. 
      const filters = uniqueCustomers.map((customerId) => ({
        text: customerId,
        value: customerId,
        key: customerId
      }));
      setCustomerIdFilters(filters);
    });
  };


  const deleteSupplier = (id) => {
  confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleFilled />,
      content: 'Delete',
      onOk() {
        // setloading(true);
       axios.delete('https://northwind.vercel.app/api/orders/' + id)
          .then(data => {
            loadData();
          })

      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }

 const columns   = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'customerId',
      dataIndex: 'customerId',
      key: 'customerId',
      filters: customerIdFilters,
        onFilter: (value, record) => record.customerId.indexOf(value) ===0,//menasını anlamadım??
        //record, tabledeki her bir rowu temsil eden obyektdir.
        sortDirections: ['descend'],
    },
    {
      title: 'freight',
      dataIndex: 'freight',
      key: 'freight',
      sorter: (a,b) => a.freight - b.freight

    },
    {
        title: 'City',
        dataIndex: 'city',
        render: (_,item)=>item.shipAddress?.city,
        key: 'City',
      },
      {
        title: 'Country',
        dataIndex: 'country',
        render: (_,item)=>item.shipAddress?.country,
        key: 'City',
      },
      {
        title: 'orderDate',
        dataIndex: 'orderDate',
        key: 'orderDate',
        sorter: (a, b) => a.orderDate - b.orderDate,
        render: (date) => {
          const formattedDate = new Date(date);
          const options = { month: 'long', day: 'numeric' };
          const formattedString = formattedDate.toLocaleDateString('en-US', options);
          const year = formattedDate.getFullYear().toString().slice(-2);
          let day= formattedDate.getDate()
          let formatString=`${formattedString} ${year}`
          if(day===1){
            formatString=`${formattedString}st ${year}`
          }
          else if (day===2){
            formatString=`${formattedString}nd ${year}`
          }
          else if (day===3){
            formatString=`${formattedString}rd ${year}`
          }
          else{
            formatString=`${formattedString}th ${year}`
          }
          return formatString;
        },
      },
      {
        title: 'requiredDate',
        dataIndex: 'requiredDate',
        key: 'requiredDate',
        render: (date) => {
          const formattedDate = new Date(date);
          const options = { month: 'long', day: 'numeric' };
          const formattedString = formattedDate.toLocaleDateString('en-US', options);
          const year = formattedDate.getFullYear().toString().slice(-2);
          let day= formattedDate.getDate()
          let formatString=`${formattedString} ${year}`
          if(day===1){
            formatString=`${formattedString}st ${year}`
          }
          else if (day===2){
            formatString=`${formattedString}nd ${year}`
          }
          else if (day===3){
            formatString=`${formattedString}rd ${year}`
          }
          else{
            formatString=`${formattedString}th ${year}`
          }
          return formatString;
        },
      },
      {
        title: 'shippedDate',
        dataIndex: 'shippedDate',
        key: 'shippedDate',
        render: (date) => {
          if (!date) return '';
          const formattedDate = new Date(date);
          const options = { month: 'long', day: 'numeric' }; 

          // ozume not: eger optionsu yazmasan tarayıcının varsayılan ayarları kullanılır.
          //meselen mende 5/15/2023 kimidir
          //day: 'numeric' günü sayısal olarak, month: 'long' ayı tam adıyla almak icin

          const formattedString = formattedDate.toLocaleDateString('en-US', options);
          //toLocaleDateString bir JavaScript fonksiyonudur ve bir tarihi belirli bir dil ve bölgeye göre biçimlendirmek için kullanılır
          const year = formattedDate.getFullYear().toString().slice(-2);
          //formattedDate.getFullYear() ifadesi bir sayı döndürür ve bizim slice metodundan
          //istifade etmeyimiz ucun onu stringe cevirmeyimiz lazimdir
          //slice yalniz stringler ucun isledile biler numberlerde -XXX
          let day= formattedDate.getDate()
          let formatString=`${formattedString} ${year}`
          if(day===1){
            formatString=`${formattedString}st ${year}`
          }
          else if (day===2){
            formatString=`${formattedString}nd ${year}`
          }
          else if (day===3){
            formatString=`${formattedString}rd ${year}`
          }
          else{
            formatString=`${formattedString}th ${year}`
          }
          return formatString;
        },
      },
      {
        title:"Delete",
        dataIndex: "id",
        key:"id",
        render:(id)=><Button  onClick={()=>deleteSupplier(id)} type='primary' danger>Delete</Button>
      }
    ]
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };

      const getRowClassName = (record) => {
        const requiredDate = new Date(record.requiredDate);
        const shippedDate = new Date(record.shippedDate);
    
        if (shippedDate > requiredDate) {
          return 'delayed-order'; // CSS class for delayed orders
        }
    
        return '';
      };
  return (
    <>
<Table  
onChange={onChange}
 dataSource={orders}
 columns={columns }
 rowClassName={getRowClassName}
//  loading={loading}
 pagination={
    {
        pageSize:9
    }}
 />
    </>
  )
}

export default AntdTable