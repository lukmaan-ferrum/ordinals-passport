curl -X POST http://localhost:3000/dev/admin/vrf/bulkUpload   \
-H "Content-Type: application/json" \
-d @sampleVRFs.json

curl -X POST https://zz5nlinr59.execute-api.us-east-2.amazonaws.com/dev/vrf/27674096908288262310177963402382394871187599216259428785863822791189860111838/update/web3Name \
-H "Content-Type: application/json" \
-d '{
  "web3Name": "satoshi"
}'

curl -X POST http://localhost:3000/dev/vrf/27674096908288262310177963402382394871187599216259428785863822791189860111838/update/web3Name \
-H "Content-Type: application/json" \
-d '{
  "web3Name": "satoshi"
}'


# encode imagge to base64. Frontend will need to do this
base64 -i pfp.jpg -o pfp_base64.txt

# Test
BASE64_IMAGE=$(cat pfp_base64.txt)
curl -X POST "https://zz5nlinr59.execute-api.us-east-2.amazonaws.com/dev/vrf/59866181108749426618976898127596939798847318118004127514311014136857891769344/update/pfp" \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"${BASE64_IMAGE}\", \"filename\":\"pfp.jpg\", \"mimetype\":\"image/jpeg\"}"