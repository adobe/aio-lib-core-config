## Functions

<dl>
<dt><a href="#get">get([key], [source])</a></dt>
<dd><p>Gets the value for a key in the Config.
If no parameters are specified, it will return all keys and values of the consolidated Config.</p>
</dd>
<dt><a href="#set">set(key, value, [local])</a></dt>
<dd><p>Set the value for a key in the Config.</p>
</dd>
<dt><a href="#delete">delete(key, [local])</a></dt>
<dd><p>Delete a key and its value in the Config.</p>
</dd>
<dt><a href="#reload">reload()</a></dt>
<dd><p>Reload the Config from all the config file(s)</p>
</dd>
<dt><a href="#getPipedData">getPipedData()</a> ⇒ <code>Promise</code></dt>
<dd><p>Pipe data from stdin.</p>
</dd>
<dt><a href="#dotenv">dotenv([force])</a></dt>
<dd><p>Hoists variables in the ./.env file to process.env</p>
</dd>
</dl>

<a name="get"></a>

## get([key], [source])
Gets the value for a key in the Config.
If no parameters are specified, it will return all keys and values of the consolidated Config.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [key] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | the key to get the value from |
| [source] | <code>string</code> |  | 'global', 'local', or 'env'. Defaults to searching the consolidated config. |

<a name="set"></a>

## set(key, value, [local])
Set the value for a key in the Config.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  | the key to set the value to |
| value | <code>string</code> |  | the value to save for the key |
| [local] | <code>string</code> | <code>false</code> | Set to true to save the value in the local config. Defaults to false (save to global config). |

<a name="delete"></a>

## delete(key, [local])
Delete a key and its value in the Config.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  | the key to delete the value from |
| [local] | <code>string</code> | <code>false</code> | Set to true to delete the value in the local config. Defaults to false (save to global config). |

<a name="reload"></a>

## reload()
Reload the Config from all the config file(s)

**Kind**: global function  
<a name="getPipedData"></a>

## getPipedData() ⇒ <code>Promise</code>
Pipe data from stdin.

**Kind**: global function  
<a name="dotenv"></a>

## dotenv([force])
Hoists variables in the ./.env file to process.env

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [force] | <code>boolean</code> | <code>false</code> | force reload of the .env file |

