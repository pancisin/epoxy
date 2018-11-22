export default ({ target, listener, freeze }) => {
  let observable;

  const set = (target, name, value) => {
    target[name] = value;
    listener(observable);
    return true;
  };

  const get = (target, name) =>  freeze ? Object.freeze(target[name]) : target[name]

  observable = new Proxy(target, {
    get,
    set
  });

  return observable;
};
