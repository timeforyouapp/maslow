import {createNodeSchema, MaslowSchema} from '../../src/api/schemas';
import { openApiDefinitions } from '../helpers/mocks';

describe('MaslowSchema', () => {
    let User = null;
    const id = 'foo';
    const name = 'bar';
    const notAllowedProp = 'fizz';
    const fakeDefinition = { ...openApiDefinitions };

    beforeEach(() => {
        User = MaslowSchema(fakeDefinition);
    });

    it('should MaslowSchema return with correct values', () => {
        const user = User({ name, id, notAllowedProp });

        expect(user).toHaveProperty('id', id);
        expect(user).toHaveProperty('name', name);

        [
            'set',
            'extractValues',
            'validate',
            'update',
            'parse',
            'prev',
            'next',
        ].forEach((prop) => {
            expect(user).toHaveProperty(prop);
        });
    });

    it('should .set, .next, .prev methods work correcty', () => {
        const user = User({ name, id, notMaxLength: notAllowedProp });
        const altName = 'fuzz';
        const newUser = user.set('name', altName);

        expect(() => user.set('id', 2)).toThrow('read only prop');

        expect(user).toHaveProperty('name', name);
        expect(newUser).toHaveProperty('name', altName);
        expect(newUser.prev()).toEqual(user);
        expect(user.next()).toEqual(newUser);
        expect(user.prev()).toBe(null);
    });

    it('should .extractValues work correctly', () => {
        const user = User({ name, id, notAllowedProp });
        const values = user.extractValues();

        expect(values).toHaveProperty('name', name);
        expect(values).toHaveProperty('id', id);
        expect(values).not.toHaveProperty('notAllowedProp');
    });

    it('should .method add a new method', () => {
        const value = 'fizz';

        User.addMethod('foo', function () {
            this.name = value;
            return this.name + value;
        });

        const user = User({ name, id, notAllowedProp });

        expect(user.foo()).toBe(value + value);
        expect(user.name).toBe(name);
    });

    it('should throw exception to .method adding a not function', () => {
        ['text', 1, 1.1, true, undefined, null, {}, []].forEach((entry) => {
            expect(() => User.addMethod('foo', entry)).toThrow('not function');
        });
    });

    it('should .parse change .extractValues', () => {
        const prefix = 'Sr.';

        User.addMethod('parse', function (values) {
            return {
                ...values,
                name: `${prefix} ${values.name}`,
            }
        });

        const user = User({ name, id, notAllowedProp });

        expect(user.extractValues()).toHaveProperty('name', `${prefix} ${name}`);
        expect(user).toHaveProperty('name', name);
    });

    it('should .update make a bulk .set', () => {
        const altName = 'fizz';
        const password = 'fuzz';
        const newPass = 'fizzfuzz';

        const user = User({ name, id, password });
        const newUser = user.update({ name: altName, password: newPass });

        expect(() => {
            user.update({ id: 3, name: altName, password: newPass });
        }).toThrow('read only prop');

        expect(user).toHaveProperty('name', name);
        expect(user).toHaveProperty('password', password);
        expect(newUser).toHaveProperty('name', altName);
        expect(newUser).toHaveProperty('password', newPass);
        expect(newUser.prev()).toEqual(user);
        expect(user.next()).toEqual(newUser);
        expect(user.prev()).toBe(null);
    });

    it('should .validate without errors', () => {
        const user = User({
            name, id,
            email: 'foo@bar.com',
            notMaxLength: 'fizz',
            password: 'fuzz',
        });

        return user.validate().then((errors) => {
            expect(errors).toBe(undefined);
        });
    });

    it('should .validate date', () => {
        const user = User({
            name, id,
            email: 'foo@bar.com',
            notMaxLength: 'fizz',
            password: 'fuzz',
            createdAt: 'aaaa',
        });

        return user.validate().then((errors) => {
            expect(errors.createdAt[0]).toHaveProperty('type', 'base');
        });
    });

    it('should .validate throw errors', () => {
        const user = User({ email: 'gui_x.com', name, id, notAllowedProp });

        return user.validate().then((errors) => {
            expect(errors.password[0]).toHaveProperty('type', 'required');
            expect(errors.notMaxLength[0]).toHaveProperty('type', 'required');
        });
    });
});