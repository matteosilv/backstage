/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Readable } from 'stream';
import { DefaultCatalogDocumentGenerator } from './DefaultCatalogDocumentGenerator';
import { DefaultCatalogCollatorFactory } from './DefaultCatalogCollatorFactory';

describe('DefaultCatalogCollatorFactory', () => {
  const config = new ConfigReader({});
  const mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn(),
    getExternalBaseUrl: jest.fn(),
  };
  const mockTokenManager: jest.Mocked<TokenManager> = {
    getToken: jest.fn().mockResolvedValue({ token: '' }),
    authenticate: jest.fn(),
  };
  const options = {
    discovery: mockDiscoveryApi,
    tokenManager: mockTokenManager,
  };

  it('has expected type', () => {
    const factory = DefaultCatalogCollatorFactory.fromConfig(config, options);
    expect(factory.type).toBe('software-catalog');
  });

  describe('getCollator', () => {
    const factory = DefaultCatalogCollatorFactory.fromConfig(config, options);

    it('instantiates collator with expected arguments', async () => {
      DefaultCatalogDocumentGenerator.fromConfig = jest.fn().mockReturnValue({
        execute: () => 'iterable',
      });

      const collator = await factory.getCollator();

      expect(DefaultCatalogDocumentGenerator.fromConfig).toBeCalledWith(
        config,
        options,
      );
      expect(collator).toBeInstanceOf(Readable);
    });
  });
});
