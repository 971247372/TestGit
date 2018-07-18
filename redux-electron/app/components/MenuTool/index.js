import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get as _get } from 'lodash';
import fs from 'fs';
import path from 'path';
import { Button, Modal } from 'antd';
import { ipcRenderer, remote } from 'electron';
import ConfigForm from './ConfigForm';

const EleMenu = remote.Menu;
const fileName = 'config.json';
const configFilePath = path.join(remote.app.getPath('userData'), fileName);
let conf = null;
if (fs.existsSync(configFilePath)) {
  conf = JSON.parse(fs.readFileSync(configFilePath));
}
class MenuTool extends Component {
  constructor(props) {
    super(props);
    const menuItem = [
      {
        label: '选项',
        submenu: [
          {
            label: '配置',
            accelerator: 'CmdOrCtrl+Shift+Z',
            click: this.onConfMenuClick
          }
        ]
      },
      {
        label: 'help',
        submenu: [{ role: 'copy' }, { role: 'paste' }]
      }
    ];
    const menuTemp = EleMenu.buildFromTemplate(menuItem);
    EleMenu.setApplicationMenu(menuTemp);

    this.state = {
      visible: false,
      host: conf.HOST,
      port: conf.PORT
    };
  }

  onConfMenuClick = () => {
    this.setState({ visible: true });
  };

  onChange = options => {
    if (options.host) {
      this.setState({ host: options.host });
    }
    if (options.port) {
      this.setState({ port: options.port });
    }
  };

  _closePanel = () => {
    this.setState({
      visible: false
    });
  };

  handleOk = () => {
    const { getFieldValue, validateFields } = this.confForm;
    validateFields(err => {
      if (!err) {
        conf.HOST = getFieldValue('host');
        conf.PORT = getFieldValue('port');
        fs.writeFile(configFilePath, JSON.stringify(conf));
        ipcRenderer.send('reload');
      }
    });
    // conf.HOST = this.state.host;
    // conf.PORT = this.state.port;
    // fs.writeFile(configFilePath, JSON.stringify(conf));
    // ipcRenderer.send('reload');
  };

  render() {
    const { visible, host, port } = this.state;
    return (
      <Modal
        visible={visible}
        title="修改配置"
        onOk={this.handleOk}
        onCancel={this._closePanel}
        okText="保存并重启"
        maskClosable={false}
      >
        <ConfigForm
          data={{ host, port }}
          onChange={this.onChange}
          ref={node => (this.confForm = node)}
        />
      </Modal>
    );
  }
}

MenuTool.propTypes = {
  // current: PropTypes.object,
  // data: PropTypes.object,
  // mapper: PropTypes.object,
  // saveMapperProp: PropTypes.func
};

const mapStateToProps = state => ({
  // current: _get(state, 'etl.current', {}),
  // mapper: selectCurrentMapper(state)
});

export default withRouter(connect(mapStateToProps)(MenuTool));
