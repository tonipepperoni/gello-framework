import { describe, it, expect } from 'vitest';
import { Option } from 'effect';
import {
  // Lens
  lens,
  prop,
  modify,
  composeLens,
  identity,
  // Optional
  optional,
  index,
  key,
  modifyOption,
  composeOptional,
  lensToOptional,
  // Prism
  prism,
  filter,
  variant,
  modifyPrism,
  composePrism,
  // Iso
  iso,
  composeIso,
  reverseIso,
  // Traversal
  each,
  filtered,
  composeLensTraversal,
  // Path helpers
  path,
  path2,
  path3,
  // Fluent API
  focus,
} from './optics';

interface Person {
  name: string;
  age: number;
  address: Address;
}

interface Address {
  street: string;
  city: string;
  zip: string;
}

const person: Person = {
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zip: '12345',
  },
};

describe('Lens', () => {
  describe('lens', () => {
    it('should create a lens from get/set functions', () => {
      const nameLens = lens<Person, string>(
        (p) => p.name,
        (name) => (p) => ({ ...p, name })
      );

      expect(nameLens.get(person)).toBe('John');
      expect(nameLens.set('Jane')(person).name).toBe('Jane');
    });
  });

  describe('prop', () => {
    it('should create a lens for a property', () => {
      const nameLens = prop<Person, 'name'>('name');
      expect(nameLens.get(person)).toBe('John');
      expect(nameLens.set('Jane')(person).name).toBe('Jane');
    });

    it('should preserve other properties', () => {
      const nameLens = prop<Person, 'name'>('name');
      const updated = nameLens.set('Jane')(person);
      expect(updated.age).toBe(30);
      expect(updated.address).toBe(person.address);
    });
  });

  describe('modify', () => {
    it('should modify the focused value', () => {
      const ageLens = prop<Person, 'age'>('age');
      const older = modify(ageLens, (age) => age + 1)(person);
      expect(older.age).toBe(31);
    });
  });

  describe('composeLens', () => {
    it('should compose two lenses', () => {
      const addressLens = prop<Person, 'address'>('address');
      const cityLens = prop<Address, 'city'>('city');
      const personCityLens = composeLens(addressLens, cityLens);

      expect(personCityLens.get(person)).toBe('Springfield');
      expect(personCityLens.set('Shelbyville')(person).address.city).toBe('Shelbyville');
    });
  });

  describe('identity', () => {
    it('should focus on the whole structure', () => {
      const idLens = identity<Person>();
      expect(idLens.get(person)).toBe(person);
      expect(idLens.set({ ...person, name: 'Jane' })(person).name).toBe('Jane');
    });
  });
});

describe('Optional', () => {
  describe('index', () => {
    it('should focus on array index', () => {
      const arr = [1, 2, 3];
      const firstOptional = index<number>(0);

      expect(Option.isSome(firstOptional.getOption(arr))).toBe(true);
      expect(Option.getOrElse(() => -1)(firstOptional.getOption(arr))).toBe(1);
    });

    it('should return None for out of bounds', () => {
      const arr = [1, 2, 3];
      const tenthOptional = index<number>(10);

      expect(Option.isNone(tenthOptional.getOption(arr))).toBe(true);
    });

    it('should update at index', () => {
      const arr = [1, 2, 3];
      const secondOptional = index<number>(1);
      const updated = secondOptional.set(99)(arr);

      expect(updated).toEqual([1, 99, 3]);
    });
  });

  describe('key', () => {
    it('should focus on record key', () => {
      const record: Record<string, number> = { a: 1, b: 2 };
      const aOptional = key<number>('a');

      expect(Option.isSome(aOptional.getOption(record))).toBe(true);
      expect(Option.getOrElse(() => -1)(aOptional.getOption(record))).toBe(1);
    });

    it('should return None for missing key', () => {
      const record: Record<string, number> = { a: 1 };
      const bOptional = key<number>('b');

      expect(Option.isNone(bOptional.getOption(record))).toBe(true);
    });
  });

  describe('modifyOption', () => {
    it('should modify if value exists', () => {
      const arr = [1, 2, 3];
      const firstOptional = index<number>(0);
      const updated = modifyOption(firstOptional, (n) => n * 10)(arr);

      expect(updated).toEqual([10, 2, 3]);
    });

    it('should do nothing if value does not exist', () => {
      const arr = [1, 2, 3];
      const tenthOptional = index<number>(10);
      const updated = modifyOption(tenthOptional, (n) => n * 10)(arr);

      expect(updated).toEqual([1, 2, 3]);
    });
  });

  describe('composeOptional', () => {
    it('should compose two optionals', () => {
      const matrix = [[1, 2], [3, 4]];
      const firstRow = index<number[]>(0);
      const secondCol = index<number>(1);
      const composed = composeOptional(firstRow, secondCol);

      expect(Option.getOrElse(() => -1)(composed.getOption(matrix))).toBe(2);
    });
  });
});

describe('Prism', () => {
  type Shape =
    | { _tag: 'Circle'; radius: number }
    | { _tag: 'Rectangle'; width: number; height: number };

  describe('filter', () => {
    it('should create a filtering prism', () => {
      const positive = filter<number>((n) => n > 0);

      expect(Option.isSome(positive.getOption(5))).toBe(true);
      expect(Option.isNone(positive.getOption(-5))).toBe(true);
    });

    it('should pass through on reverseGet', () => {
      const positive = filter<number>((n) => n > 0);
      expect(positive.reverseGet(42)).toBe(42);
    });
  });

  describe('variant', () => {
    it('should match discriminated union variant', () => {
      const circle: Shape = { _tag: 'Circle', radius: 10 };
      const rectangle: Shape = { _tag: 'Rectangle', width: 5, height: 10 };

      const circlePrism = variant<Shape, { _tag: 'Circle'; radius: number }>('Circle');

      expect(Option.isSome(circlePrism.getOption(circle))).toBe(true);
      expect(Option.isNone(circlePrism.getOption(rectangle))).toBe(true);
    });
  });

  describe('modifyPrism', () => {
    it('should modify if prism matches', () => {
      const positive = filter<number>((n) => n > 0);
      const doubled = modifyPrism(positive, (n) => n * 2);

      expect(doubled(5)).toBe(10);
      expect(doubled(-5)).toBe(-5);
    });
  });
});

describe('Iso', () => {
  describe('iso', () => {
    it('should create an isomorphism', () => {
      const celsiusToFahrenheit = iso<number, number>(
        (c) => c * 9 / 5 + 32,
        (f) => (f - 32) * 5 / 9
      );

      expect(celsiusToFahrenheit.get(0)).toBe(32);
      expect(celsiusToFahrenheit.reverseGet(32)).toBeCloseTo(0);
    });
  });

  describe('reverseIso', () => {
    it('should reverse an iso', () => {
      const original = iso<number, string>(
        (n) => n.toString(),
        (s) => parseInt(s, 10)
      );
      const reversed = reverseIso(original);

      expect(reversed.get('42')).toBe(42);
      expect(reversed.reverseGet(42)).toBe('42');
    });
  });
});

describe('Traversal', () => {
  describe('each', () => {
    it('should get all elements', () => {
      const arr = [1, 2, 3];
      const eachNum = each<number>();

      expect(eachNum.getAll(arr)).toEqual([1, 2, 3]);
    });

    it('should modify all elements', () => {
      const arr = [1, 2, 3];
      const eachNum = each<number>();
      const doubled = eachNum.modifyAll((n) => n * 2)(arr);

      expect(doubled).toEqual([2, 4, 6]);
    });
  });

  describe('filtered', () => {
    it('should get filtered elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const evens = filtered<number>((n) => n % 2 === 0);

      expect(evens.getAll(arr)).toEqual([2, 4]);
    });

    it('should modify only matching elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const evens = filtered<number>((n) => n % 2 === 0);
      const doubledEvens = evens.modifyAll((n) => n * 2)(arr);

      expect(doubledEvens).toEqual([1, 4, 3, 8, 5]);
    });
  });

  describe('composeLensTraversal', () => {
    it('should compose lens with traversal', () => {
      interface Team {
        name: string;
        members: readonly string[];
      }

      const team: Team = { name: 'A-Team', members: ['John', 'Jane', 'Bob'] };
      const membersLens = prop<Team, 'members'>('members');
      const eachMember = each<string>();
      const teamMembersTraversal = composeLensTraversal(membersLens, eachMember);

      expect(teamMembersTraversal.getAll(team)).toEqual(['John', 'Jane', 'Bob']);
      expect(teamMembersTraversal.modifyAll((s) => s.toUpperCase())(team).members)
        .toEqual(['JOHN', 'JANE', 'BOB']);
    });
  });
});

describe('Path helpers', () => {
  describe('path', () => {
    it('should create a lens for a path', () => {
      const namePath = path<Person, 'name'>('name');
      expect(namePath.get(person)).toBe('John');
    });
  });

  describe('path2', () => {
    it('should create a lens for a 2-level path', () => {
      const cityPath = path2<Person, 'address', 'city'>('address', 'city');
      expect(cityPath.get(person)).toBe('Springfield');
      expect(cityPath.set('Shelbyville')(person).address.city).toBe('Shelbyville');
    });
  });

  describe('path3', () => {
    it('should create a lens for a 3-level path', () => {
      interface Nested {
        level1: {
          level2: {
            level3: string;
          };
        };
      }
      const nested: Nested = { level1: { level2: { level3: 'deep' } } };
      const deepPath = path3<Nested, 'level1', 'level2', 'level3'>('level1', 'level2', 'level3');

      expect(deepPath.get(nested)).toBe('deep');
    });
  });
});

describe('Fluent API', () => {
  describe('focus', () => {
    it('should allow chained property access', () => {
      const cityFocus = focus<Person>().at('address').at('city');
      expect(cityFocus.get(person)).toBe('Springfield');
    });

    it('should allow chained modification', () => {
      const cityFocus = focus<Person>().at('address').at('city');
      const updated = cityFocus.set('Shelbyville')(person);
      expect(updated.address.city).toBe('Shelbyville');
    });

    it('should allow modify with function', () => {
      const ageFocus = focus<Person>().at('age');
      const older = ageFocus.modify((a) => a + 1)(person);
      expect(older.age).toBe(31);
    });
  });
});

describe('Real-world example', () => {
  interface State {
    users: readonly User[];
    selectedUserId: string | null;
  }

  interface User {
    id: string;
    profile: Profile;
    settings: Settings;
  }

  interface Profile {
    name: string;
    email: string;
  }

  interface Settings {
    notifications: boolean;
    theme: 'light' | 'dark';
  }

  const initialState: State = {
    users: [
      {
        id: '1',
        profile: { name: 'Alice', email: 'alice@example.com' },
        settings: { notifications: true, theme: 'light' },
      },
      {
        id: '2',
        profile: { name: 'Bob', email: 'bob@example.com' },
        settings: { notifications: false, theme: 'dark' },
      },
    ],
    selectedUserId: '1',
  };

  it('should update nested state immutably', () => {
    const usersLens = prop<State, 'users'>('users');
    const firstUser = index<User>(0);
    const settingsLens = prop<User, 'settings'>('settings');
    const themeLens = prop<Settings, 'theme'>('theme');

    const firstUserSettingsTheme = composeOptional(
      lensToOptional(composeLens(usersLens, composeLens(settingsLens, themeLens) as any)),
      lensToOptional(identity()) as any
    );

    // Using traversal to update all users
    const allUsersTheme = composeLensTraversal(
      usersLens,
      each<User>()
    );

    const updatedState = allUsersTheme.modifyAll((user) => ({
      ...user,
      settings: { ...user.settings, theme: 'dark' as const },
    }))(initialState);

    expect(updatedState.users[0].settings.theme).toBe('dark');
    expect(updatedState.users[1].settings.theme).toBe('dark');
  });
});
