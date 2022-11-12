let obj = JSON.parse($response.body);
obj.license.status = 'sub';
obj.license.expireTime = 0x1b8d90e4000;
$done({ body: JSON.stringify(obj) });
