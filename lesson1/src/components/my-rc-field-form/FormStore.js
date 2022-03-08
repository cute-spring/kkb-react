// store 状态管理库
export class FormStore {
  constructor() {
    // 开辟一个空间存储我的状态 {} store
    this.store = {};

    // 开辟一个空间存储Fields
    this.fieldEntities = [];

    // 开辟一个空间存储callbacks
    this.callbacks = {};

    this.observers = [];
  }

  register = (observer) => {
    this.observers.push(observer);

    return () => {
      this.observers = this.observers.filter((item) => item !== observer);
    };
  };

  setCallbacks = (newCallbacks) => {
    this.callbacks = {
      ...this.callbacks,
      ...newCallbacks,
    };
  };

  // set
  // 订阅和取消订阅，监听和取消监听要成对出现
  setFieldEntities = (entity) => {
    this.fieldEntities.push(entity);

    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);
      // delete this.store[entity.props.name];
    };
  };

  delFieldValue = (entity) => {
    delete this.store[entity.props.name];
  };

  // get 获取全部状态
  getFieldsValue = () => {
    return { ...this.store };
  };

  // 获取单个状态
  getFieldValue = (name) => {
    return this.store[name];
  };

  // set  设置状态
  //old {username: '123', password: 456}
  // new {usernmae:'1234'}
  setFieldsValue = (newStore) => {
    // 1. 更新store
    this.store = {
      ...this.store,
      ...newStore,
    };
    console.log("this.store", this.store); //sy-log

    // 2. 更新组件
    // todo
    const keys = Object.keys(newStore);
    this.fieldEntities.forEach((entity) => {
      //   if (keys.indexOf(entity.props.name) > -1) {
      entity.onStoreChange(keys);
      //   }
    });
  };

  validate = () => {
    // 存储错误信息
    let err = [];

    // todo 校验

    return err;
  };

  submit = () => {
    let err = this.validate();
    const { onFinish, onFinishFailed } = this.callbacks;
    if (err.length > 0) {
      // 出错了
      onFinishFailed(err, this.getFieldsValue());
    } else {
      // 校验通过
      onFinish(this.getFieldsValue());
    }
  };

  getForm = () => {
    return {
      delFieldValue: this.delFieldValue,
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      setFieldEntities: this.setFieldEntities,
      setCallbacks: this.setCallbacks,
      submit: this.submit,
    };
  };
}
export default FormStore;
