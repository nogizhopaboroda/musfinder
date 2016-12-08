import Router from '../src/router';

//set initial url to /
window.history.replaceState(null, null, '/');

describe("Base functionality", () => {
  const router = new Router();

  it('returns root correctly', () => {
    assert.equal(router.root, '');
  });

  it('matches root correctly', () => {
    assert.equal(router.root_matches, true);
  });

  it('returns query string correctly', () => {
    assert.equal(router.qs, false);
  });

  it('returns query params correctly', () => {
    assert.deepEqual(router.params, {});
  });

  it('returns absolute path correctly', () => {
    assert.equal(router.global_path, '/');
  });

  it('returns relative path correctly', () => {
    assert.equal(router.path, '/');
  });

  it('adds handlers correctly', () => {
    let handler = () => {};
    router.add('/', handler);
    assert.equal(router.listeners.length, 1);
    assert.equal(router.listeners[0].callback, handler);
  });

  it('navigates correctly', () => {
    router.navigate('/bar');
    assert.equal(router.path, '/bar');
  });

  it('handles route correctly', () => {
    let flag = false;
    let handler = () => flag = true;
    router.add('/foo', handler);
    router.navigate('/foo');
    assert.equal(flag, true);
  });

});
