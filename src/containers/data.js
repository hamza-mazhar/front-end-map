import {getDepartments, getObjByDepartmentId,
  getObjectDetailsById,getSearchObjByDepartmentId} from "../api/mesuem"



const getDataAt1stRender = () => {
  return new Promise((resolve,reject)=>{
    let reqData = [];
    getDepartments().then( async response=>{
      if(response.status === 200){
        const{departments} = response.data;
        for(let i = 0 ; i< departments.length; i++ ){
          let requireObj = {
            departmentId: '',
            departmentName: "",
            totalObject: 0,
          }
          requireObj.departmentName = departments[i].displayName
          requireObj.departmentId = departments[i].departmentId
         await getObjByDepartmentId(departments[i].departmentId)
            .then( async departmentObject=>{
            if(departmentObject.status === 200){
              const {objectIDs,total} = departmentObject.data
              requireObj.totalObject = total
              let ObjectDetailsArray = []
              if(departmentObject.data && total>0){
                for(let j = 0; j< 10  ;j ++){
                  if(objectIDs[j]){
                  await  getObjectDetailsById(objectIDs[j]).then(  objectDetails=> {
                      if(objectDetails.status === 200){
                        ObjectDetailsArray.push(objectDetails.data)
                      }
                    }).catch(error=>{
                      reject(error)
                    })
                  }
                }
              }
              delete requireObj['ObjectDetails']
              requireObj = {ObjectDetails:ObjectDetailsArray,...requireObj}
            }
          })
            .catch(error=>{
            reject(error)
          })

          reqData.push(requireObj)
        }
        resolve(reqData)
      }
    }).catch(error=>{
      reject(error)
    })
  })
}


const searchQueryByDept = (queryString) => {
  return new Promise((resolve,reject)=>{
    let reqSearchData = [];
      getDepartments().then( async response=>{
      if(response.status === 200){
        const{departments} = response.data;
        for(let i = 0 ; i< departments.length; i++ ){
          let requireObj = {
            departmentId: '',
            departmentName: "",
            totalObject: 0,
            ObjectDetails:[]
          }
          requireObj.departmentName = departments[i].displayName
          requireObj.departmentId = departments[i].departmentId
          await getSearchObjByDepartmentId(departments[i].departmentId,queryString)
            .then( async departmentObject=>{
              if(departmentObject.status === 200){
                const {objectIDs,total} = departmentObject.data
                requireObj.totalObject = total
                let ObjectDetailsArray = []
                if(departmentObject.data && total>0){
                  for(let j = 0; j< total  ;j ++){
                    if(objectIDs[j]){
                      await  getObjectDetailsById(objectIDs[j]).then(  objectDetails=> {
                        if(objectDetails.status === 200){
                          ObjectDetailsArray.push(objectDetails.data)
                        }
                      }).catch(error=>{
                        console.log("+++++++++++12")
                        // reject(error)
                      })
                    }
                  }
                }
                delete requireObj['ObjectDetails']
                requireObj = {ObjectDetails:ObjectDetailsArray,...requireObj}
              }else{
                delete requireObj['ObjectDetails']
                requireObj = {ObjectDetails:[],...requireObj}
              }
            })
            .catch(error=>{
              console.log("+++++++++++11")
              // reject(error)
            })
          reqSearchData.push(requireObj)
        }
        console.log("++++++++++final object",reqSearchData)
        resolve(reqSearchData)
      }else{
        resolve(reqSearchData)
      }
    }).catch(error=>{
       console.log("+++++++++++15")
       reject(error)
    })
  })

}

export {getDataAt1stRender,searchQueryByDept}
