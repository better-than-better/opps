import React, { useState, useEffect } from 'react';
import HelloWorld from '@components/hello-world';
import API from '@api'

import './index.pcss';

const PageTpl = () => {
  document.title = 'page tpl';

  const fetchSomeData = async () => {
    const data = await API.fetchSomeData();

    console.log(data);
  };

  useEffect(() => {
    fetchSomeData();
  }, true);

  return (
    <div className="page-tpl">
      模板页
      <HelloWorld />
    </div>
  );
}

export default PageTpl;
