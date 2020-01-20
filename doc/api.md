<a name="ConfigAPI"></a>

## ConfigAPI
This class provides methods to access the config for Adobe I/O libraries.

**Kind**: global class  

* [ConfigAPI](#ConfigAPI)
    * [.get([key], [source])](#ConfigAPI+get)
    * [.set(key, value, [local])](#ConfigAPI+set)
    * [.delete(key, [local])](#ConfigAPI+delete)
    * [.reload()](#ConfigAPI+reload)
    * [.getPipedData()](#ConfigAPI+getPipedData) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.dotenv(the)](#ConfigAPI+dotenv)

<a name="ConfigAPI+get"></a>

### configAPI.get([key], [source])
Gets the value for a key in the Config.
If no parameters are specified, it will return all keys and values of the consolidated Config.

**Kind**: instance method of [<code>ConfigAPI</code>](#ConfigAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [key] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | the key to get the value from |
| [source] | <code>string</code> |  | 'global', 'local', or 'env'. Defaults to searching the consolidated config. |

<a name="ConfigAPI+set"></a>

### configAPI.set(key, value, [local])
Set the value for a key in the Config.

**Kind**: instance method of [<code>ConfigAPI</code>](#ConfigAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  | the key to set the value to |
| value | <code>string</code> |  | the value to save for the key |
| [local] | <code>boolean</code> | <code>false</code> | Set to true to save the value in the local config. Defaults to false (save to global config). |

<a name="ConfigAPI+delete"></a>

### configAPI.delete(key, [local])
Delete a key and its value in the Config.

**Kind**: instance method of [<code>ConfigAPI</code>](#ConfigAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  | the key to delete the value from |
| [local] | <code>boolean</code> | <code>false</code> | Set to true to delete the value in the local config. Defaults to false (save to global config). |

<a name="ConfigAPI+reload"></a>

### configAPI.reload()
Reload the Config from all the config file(s)

**Kind**: instance method of [<code>ConfigAPI</code>](#ConfigAPI)  
<a name="ConfigAPI+getPipedData"></a>

### configAPI.getPipedData() ⇒ <code>Promise.&lt;string&gt;</code>
Pipe data from stdin.

**Kind**: instance method of [<code>ConfigAPI</code>](#ConfigAPI)  
<a name="ConfigAPI+dotenv"></a>

### configAPI.dotenv(the)
Hoists variables in the ./.env file to process.env

**Kind**: instance method of [<code>ConfigAPI</code>](#ConfigAPI)  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>Object</code> | dotenv object |

