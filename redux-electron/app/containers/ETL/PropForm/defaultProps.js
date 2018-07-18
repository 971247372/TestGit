const canvas = {
  name: {
    component: '',
    label: '名称',
    ref: 'name',
  },
  limitSize: {
    component: 'inputNumber',
    label: '每次抽取数量',
    ref: 'limitSize',
    defaultValue: 1000
  },
  // extensionSql: {
  //   component: '',
  //   label: '可扩展字段',
  //   ref: 'extensionSql'
  // },
  whereSql: {
    component: '',
    label: '筛选条件',
    ref: 'whereSql'
  },
  sourceDataIdentificationColumn: {
    component: 'dropdown',
    label: '增量校验字段',
    ref: 'sourceDataIdentificationColumn',
    source: 'coulmns'
  },
  sourceDataIdentificationValue: {
    component: '',
    label: '增量校验当前值',
    ref: 'sourceDataIdentificationValue'
  },
  targetTableRadio: {
    component: 'radio',
    label: '目标表主键',
    ref: 'targetTableRadio',
    values: ['新增', '新增并更新'],
    defaultValue: '新增'
  },
  targetTableKey: {
    component: 'dropdown',
    label: '',
    ref: 'targetTableKey',
    target: 'targetTableRadio',
    targetValue: '新增并更新'
  },
  backType: {
    component: 'dropdown',
    label: '备份类型',
    ref: 'backType',
    values: ['FILE'],
    defaultValue: 'FILE'
  }
};

const column = {
  source: {
    targetPort: {
      component: 'radio',
      label: '目标字段名称',
      ref: 'linkPorts',
      source: 'mapper'
    },
    sourceColumnName: {
      component: '',
      label: '源字段名称',
      ref: 'sourceColumnName',
      source: 'targetPort'
    }
  },
  target: {
    script: {
      component: '',
      label: '脚本',
      ref: 'script',
    },
    transformer: {
      component: 'dropdown',
      label: '转换函数',
      ref: 'transformer',
      values: ['COPY', 'CONCAT', 'GROOVYSCRIPT'],
      defaultValue: 'COPY'
    }
  }
};

export { canvas, column };
