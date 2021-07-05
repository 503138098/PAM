public class BatchToUpdateValidToDateOnPBItems implements Database.Batchable<Sobject>{
    public Id priceBookId;
    
    public BatchToUpdateValidToDateOnPBItems(Id pbId){
        priceBookId = pbId;
    }
    
    public Database.QueryLocator start(Database.BatchableContext bc){      
        string query = 'Select Id,Valid_To_Date__c,FX5__Price_Book__c from FX5__Price_Book_Item__c where FX5__Price_Book__c=\'' + priceBookId + '\'';
        return Database.getQueryLocator(query);
    }
    
    public void execute(Database.BatchableContext bc,List<FX5__Price_Book_Item__c> pbItems){        
        FX5__Price_Book__c p = [Select Id,FX5__Expiration_Date__c from FX5__Price_Book__c where Id=:priceBookId AND FX5__Expiration_Date__c != NULL];
        List<FX5__Price_Book_Item__c> updatePriceBookList = new List<FX5__Price_Book_Item__c>();
        for(FX5__Price_Book_Item__c pbItem : pbItems){
            if(pbItem.FX5__Price_Book__c == priceBookId){
                //if(pbItem.Valid_To_Date__c < System.today()){
                    pbItem.Valid_To_Date__c = p.FX5__Expiration_Date__c;
                    updatePriceBookList.add(pbItem); 
                //}                
                
            }            
        }
        
        if(updatePriceBookList.size()>0){
            Database.update(updatePriceBookList,false);            
        }
        
    }
    
    public void finish(Database.BatchableContext bc){
        
    }
    
    @AuraEnabled
    public static void execute(Id pbId){
        System.debug('-----------'+pbId);
        BatchToUpdateValidToDateOnPBItems batchable = new BatchToUpdateValidToDateOnPBItems(pbId);
        Database.executeBatch(batchable,200);
        
    }
}